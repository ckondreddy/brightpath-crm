import { supabase } from '../lib/supabaseClient'
import { Database } from '../types/database.types'
import { Lead, LeadSource, UserProfile } from '../types'

type LeadInsert = Database['public']['Tables']['leads']['Insert']
type ActivityInsert = Database['public']['Tables']['activities']['Insert']

export interface CreateLeadInput {
  full_name: string
  phone: string
  email?: string
  course_interest: string
  source: LeadSource
  assigned_to?: string | null
  notes?: string
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
 * Validates lead creation inputs according to coaching CRM domain rules.
 */
export function validateLeadInput(input: CreateLeadInput): LeadValidationErrors {
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
  // Guard: Ensure Supabase client is initialized
  if (!supabase) {
    return { data: null, error: 'Database client is not configured. Please check connection settings.' }
  }

  // Validate inputs first
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

    // 1. Insert into public.leads
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

    // 2. Automatically log lead creation activity in public.activities
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
      // Non-blocking warning: activity failed to record but lead is safely persisted
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
