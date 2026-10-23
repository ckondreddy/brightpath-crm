import { supabase } from '../lib/supabaseClient'
import { Database } from '../types/database.types'
import { Lead, LeadSource, LeadStatus, UserProfile, FollowUp } from '../types'

type LeadInsert = Database['public']['Tables']['leads']['Insert']
type ActivityInsert = Database['public']['Tables']['activities']['Insert']

export interface LeadWithRelations extends Lead {
  assignee?: UserProfile | null
  follow_ups?: {
    id: string
    due_at: string
    status: 'pending' | 'completed' | 'cancelled'
    note: string
  }[]
}

export interface ActivityWithActor {
  id: string
  lead_id: string
  actor_id: string | null
  activity_type: 'lead_created' | 'status_updated' | 'note_added' | 'follow_up_scheduled' | 'follow_up_completed' | 'lead_edited'
  description: string
  metadata?: Record<string, unknown> | null
  created_at: string
  actor?: UserProfile | null
}

export interface LeadDetailWithRelations extends LeadWithRelations {
  creator?: UserProfile | null
  follow_ups?: FollowUp[]
  activities?: ActivityWithActor[]
}

export interface FetchLeadsOptions {
  searchQuery?: string
  status?: LeadStatus | 'all'
  source?: LeadSource | 'all'
  assignedTo?: string | 'all'
  sortBy?: 'created_at' | 'full_name' | 'status'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface FetchLeadsResult {
  data: LeadWithRelations[]
  count: number
  error: string | null
}

export interface LeadStatusCounts {
  all: number
  New: number
  Contacted: number
  Qualified: number
  Converted: number
  Lost: number
}

export interface CreateLeadInput {
  full_name: string
  phone: string
  email?: string
  course_interest: string
  source: LeadSource
  assigned_to?: string | null
  notes?: string
}

export interface UpdateLeadInput {
  full_name: string
  phone: string
  email?: string | null
  course_interest: string
  source: LeadSource
  assigned_to?: string | null
  notes?: string | null
}

export interface LeadValidationErrors {
  full_name?: string
  phone?: string
  email?: string
  course_interest?: string
  source?: string
  general?: string
}

/**
 * Validates lead creation & editing inputs according to coaching CRM domain rules.
 */
export function validateLeadInput(input: CreateLeadInput | UpdateLeadInput): LeadValidationErrors {
  const errors: LeadValidationErrors = {}

  // 1. Full name validation (required, trimmed, min 2 chars)
  const trimmedName = input.full_name?.trim() || ''
  if (!trimmedName) {
    errors.full_name = 'Student full name is required.'
  } else if (trimmedName.length < 2) {
    errors.full_name = 'Name must be at least 2 characters.'
  }

  // 2. Phone validation (required, min 7 digits, digits and standard symbols)
  const trimmedPhone = input.phone?.trim() || ''
  const digitsOnly = trimmedPhone.replace(/\D/g, '')
  if (!trimmedPhone) {
    errors.phone = 'Contact phone number is required.'
  } else if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    errors.phone = 'Please enter a valid phone number (7 to 15 digits).'
  }

  // 3. Email validation (optional, but must be valid format if provided)
  const trimmedEmail = input.email?.trim() || ''
  if (trimmedEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address (e.g. student@gmail.com).'
    }
  }

  // 4. Course interest validation (required)
  const trimmedCourse = input.course_interest?.trim() || ''
  if (!trimmedCourse) {
    errors.course_interest = 'Please select a program or course of interest.'
  }

  // 5. Source validation (required)
  if (!input.source) {
    errors.source = 'Please select an enquiry lead source.'
  }

  return errors
}

/**
 * Creates a new student enquiry lead and automatically generates an audit activity log.
 */
export async function createLead(
  input: CreateLeadInput,
  currentUserId: string
): Promise<{ data: Lead | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: 'Database client is not configured. Please check connection settings.' }
  }

  const validationErrors = validateLeadInput(input)
  const firstErrorKey = Object.keys(validationErrors)[0] as keyof LeadValidationErrors | undefined
  if (firstErrorKey) {
    return { data: null, error: validationErrors[firstErrorKey] || 'Validation failed.' }
  }

  try {
    const payload: LeadInsert = {
      full_name: input.full_name.trim(),
      phone: input.phone.trim(),
      email: input.email?.trim() || null,
      course_interest: input.course_interest.trim(),
      source: input.source,
      status: 'New',
      assigned_to: input.assigned_to || currentUserId || null,
      created_by: currentUserId || null,
      notes: input.notes?.trim() || null,
    }

    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .insert(payload)
      .select()
      .single()

    if (leadError) {
      console.error('Failed to create lead in Supabase:', leadError)
      return { data: null, error: leadError.message }
    }

    const createdLead = leadData as Lead

    const activityPayload: ActivityInsert = {
      lead_id: createdLead.id,
      actor_id: currentUserId || null,
      activity_type: 'lead_created',
      description: `New enquiry registered for ${createdLead.course_interest} via ${createdLead.source}`,
      metadata: {
        source: createdLead.source,
        course_interest: createdLead.course_interest,
        assigned_to: createdLead.assigned_to,
      },
    }

    const { error: activityError } = await supabase
      .from('activities')
      .insert(activityPayload)

    if (activityError) {
      console.warn('Lead was created, but failed to record audit activity:', activityError)
    }

    return { data: createdLead, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred while saving the lead.'
    return { data: null, error: message }
  }
}

/**
 * Fetches active staff profiles to populate assignee dropdowns.
 */
export async function fetchStaffProfiles(): Promise<{ data: UserProfile[]; error: string | null }> {
  if (!supabase) {
    return { data: [], error: 'Database client is not configured.' }
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, created_at, updated_at')
      .order('full_name', { ascending: true })

    if (error) {
      return { data: [], error: error.message }
    }

    return { data: (data as UserProfile[]) || [], error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch staff members.'
    return { data: [], error: message }
  }
}

/**
 * Fetches paginated, filtered, and sorted leads with joined assignee and follow-up data.
 */
export async function fetchLeads(options: FetchLeadsOptions = {}): Promise<FetchLeadsResult> {
  if (!supabase) {
    return { data: [], count: 0, error: 'Database client is not configured.' }
  }

  const {
    searchQuery,
    status = 'all',
    source = 'all',
    assignedTo = 'all',
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    pageSize = 20,
  } = options

  try {
    let query = supabase
      .from('leads')
      .select(
        '*, assignee:profiles!leads_assigned_to_fkey(id, full_name, role), follow_ups(id, due_at, status, note)',
        { count: 'exact' }
      )

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (source && source !== 'all') {
      query = query.eq('source', source)
    }

    if (assignedTo && assignedTo !== 'all') {
      query = query.eq('assigned_to', assignedTo)
    }

    if (searchQuery && searchQuery.trim()) {
      const sanitized = searchQuery.trim().replace(/[%_]/g, '')
      if (sanitized) {
        query = query.or(
          `full_name.ilike.%${sanitized}%,phone.ilike.%${sanitized}%,email.ilike.%${sanitized}%,course_interest.ilike.%${sanitized}%`
        )
      }
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, count, error } = await query

    if (error) {
      console.error('Failed to fetch leads from Supabase:', error)
      return { data: [], count: 0, error: error.message }
    }

    return {
      data: (data as unknown as LeadWithRelations[]) || [],
      count: count || 0,
      error: null,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An error occurred while fetching enquiries.'
    return { data: [], count: 0, error: message }
  }
}

/**
 * Retrieves live counts for each lead pipeline stage to power segmented tabs.
 */
export async function fetchLeadStatusCounts(): Promise<LeadStatusCounts> {
  const defaultCounts: LeadStatusCounts = {
    all: 0,
    New: 0,
    Contacted: 0,
    Qualified: 0,
    Converted: 0,
    Lost: 0,
  }

  if (!supabase) return defaultCounts

  try {
    const [allRes, newRes, contactedRes, qualifiedRes, convertedRes, lostRes] = await Promise.all([
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'New'),
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'Contacted'),
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'Qualified'),
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'Converted'),
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'Lost'),
    ])

    return {
      all: allRes.count || 0,
      New: newRes.count || 0,
      Contacted: contactedRes.count || 0,
      Qualified: qualifiedRes.count || 0,
      Converted: convertedRes.count || 0,
      Lost: lostRes.count || 0,
    }
  } catch (err) {
    console.error('Failed to retrieve status counts:', err)
    return defaultCounts
  }
}

/**
 * Fetches complete details of a single lead including creator, assignee, follow-ups, and audit activities.
 */
export async function fetchLeadById(
  id: string
): Promise<{ data: LeadDetailWithRelations | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: 'Database client is not configured.' }
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .select(
        '*, assignee:profiles!leads_assigned_to_fkey(id, full_name, role), creator:profiles!leads_created_by_fkey(id, full_name, role), follow_ups(*), activities(*, actor:profiles(id, full_name, role))'
      )
      .eq('id', id)
      .order('created_at', { referencedTable: 'activities', ascending: false })
      .order('due_at', { referencedTable: 'follow_ups', ascending: true })
      .single()

    if (error) {
      console.error('Failed to fetch lead by ID:', error)
      return { data: null, error: error.message }
    }

    return { data: data as unknown as LeadDetailWithRelations, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve enquiry details.'
    return { data: null, error: message }
  }
}

/**
 * Updates lead pipeline status with mandatory lost reason enforcement and audit logging.
 */
export async function updateLeadStatus(
  leadId: string,
  newStatus: LeadStatus,
  lostReason: string | null,
  currentUserId: string,
  oldStatus: LeadStatus
): Promise<{ data: Lead | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: 'Database client is not configured.' }
  }

  // Strict validation: if marking as Lost, lost_reason is mandatory
  if (newStatus === 'Lost' && (!lostReason || !lostReason.trim())) {
    return { data: null, error: 'A reason is required when marking an enquiry as Lost.' }
  }

  try {
    const updatePayload = {
      status: newStatus,
      lost_reason: newStatus === 'Lost' ? lostReason?.trim() : null,
      updated_at: new Date().toISOString(),
    }

    const { data: leadData, error: updateError } = await supabase
      .from('leads')
      .update(updatePayload)
      .eq('id', leadId)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to update lead status:', updateError)
      return { data: null, error: updateError.message }
    }

    // Automatically record activity log
    const description =
      newStatus === 'Lost'
        ? `Enquiry marked as Lost: ${lostReason?.trim()}`
        : `Stage progressed from ${oldStatus} to ${newStatus}`

    const activityPayload: ActivityInsert = {
      lead_id: leadId,
      actor_id: currentUserId || null,
      activity_type: 'status_updated',
      description,
      metadata: {
        old_status: oldStatus,
        new_status: newStatus,
        lost_reason: newStatus === 'Lost' ? lostReason?.trim() : null,
      },
    }

    await supabase.from('activities').insert(activityPayload)

    return { data: leadData as Lead, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update lead status.'
    return { data: null, error: message }
  }
}

/**
 * Updates student contact, program, and counsellor details with audit logging.
 */
export async function updateLeadDetails(
  leadId: string,
  input: UpdateLeadInput,
  currentUserId: string
): Promise<{ data: Lead | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: 'Database client is not configured.' }
  }

  const validationErrors = validateLeadInput(input)
  const firstErrorKey = Object.keys(validationErrors)[0] as keyof LeadValidationErrors | undefined
  if (firstErrorKey) {
    return { data: null, error: validationErrors[firstErrorKey] || 'Validation failed.' }
  }

  try {
    const updatePayload = {
      full_name: input.full_name.trim(),
      phone: input.phone.trim(),
      email: input.email?.trim() || null,
      course_interest: input.course_interest.trim(),
      source: input.source,
      assigned_to: input.assigned_to || null,
      notes: input.notes?.trim() || null,
      updated_at: new Date().toISOString(),
    }

    const { data: leadData, error: updateError } = await supabase
      .from('leads')
      .update(updatePayload)
      .eq('id', leadId)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to update lead details:', updateError)
      return { data: null, error: updateError.message }
    }

    const activityPayload: ActivityInsert = {
      lead_id: leadId,
      actor_id: currentUserId || null,
      activity_type: 'lead_edited',
      description: `Student details updated (${input.full_name}, ${input.course_interest})`,
      metadata: {
        course_interest: input.course_interest,
        assigned_to: input.assigned_to,
      },
    }

    await supabase.from('activities').insert(activityPayload)

    return { data: leadData as Lead, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update lead details.'
    return { data: null, error: message }
  }
}

export interface LeadSelectItem {
  id: string
  full_name: string
  phone: string
  course_interest: string
  status: LeadStatus
  assigned_to: string | null
}

export async function fetchLeadsForSelect(): Promise<{ data: LeadSelectItem[]; error: string | null }> {
  if (!supabase) {
    return { data: [], error: 'Database client is not configured.' }
  }
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('id, full_name, phone, course_interest, status, assigned_to')
      .neq('status', 'Lost')
      .order('full_name', { ascending: true })
      .limit(100)

    if (error) {
      return { data: [], error: error.message }
    }
    return { data: (data as LeadSelectItem[]) || [], error: null }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch leads for selection.'
    return { data: [], error: msg }
  }
}

