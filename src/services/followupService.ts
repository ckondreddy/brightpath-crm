import { supabase } from '../lib/supabaseClient'
import { Database } from '../types/database.types'
import { UserProfile, FollowUpStatus } from '../types'

type FollowUpInsert = Database['public']['Tables']['follow_ups']['Insert']
type ActivityInsert = Database['public']['Tables']['activities']['Insert']

export interface FollowUpWithLead {
  id: string
  lead_id: string
  assigned_to: string | null
  due_at: string
  note: string
  status: FollowUpStatus
  completed_at: string | null
  created_by: string | null
  created_at: string
  lead?: {
    id: string
    full_name: string
    phone: string
    course_interest: string
    status: string
    assigned_to: string | null
  } | null
  assignee?: UserProfile | null
}

export type FollowUpTab = 'overdue' | 'today' | 'upcoming' | 'completed' | 'all'

export interface FollowUpCounts {
  overdue: number
  today: number
  upcoming: number
  completed: number
  totalPending: number
}

export interface FetchFollowUpsOptions {
  tab: FollowUpTab
  counsellorId?: string
  searchQuery?: string
}

/**
 * Fetch follow-up tasks segmented by status/due date
 */
export async function fetchFollowUps(
  options: FetchFollowUpsOptions
): Promise<{ data: FollowUpWithLead[]; error: string | null }> {
  if (!supabase) {
    return { data: [], error: 'Database client is not configured.' }
  }

  try {
    const { tab, counsellorId, searchQuery } = options

    const now = new Date()
    const nowIso = now.toISOString()

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString()
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString()

    let query = supabase
      .from('follow_ups')
      .select(`
        *,
        lead:leads(id, full_name, phone, course_interest, status, assigned_to),
        assignee:profiles!follow_ups_assigned_to_fkey(id, full_name, role)
      `)

    // Apply tab condition
    if (tab === 'overdue') {
      query = query
        .eq('status', 'pending')
        .lt('due_at', nowIso)
        .order('due_at', { ascending: true })
    } else if (tab === 'today') {
      query = query
        .eq('status', 'pending')
        .gte('due_at', startOfToday)
        .lte('due_at', endOfToday)
        .order('due_at', { ascending: true })
    } else if (tab === 'upcoming') {
      query = query
        .eq('status', 'pending')
        .gt('due_at', endOfToday)
        .order('due_at', { ascending: true })
    } else if (tab === 'completed') {
      query = query
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
    } else {
      // 'all'
      query = query.order('due_at', { ascending: true })
    }

    // Counsellor filter
    if (counsellorId && counsellorId !== 'all') {
      query = query.eq('assigned_to', counsellorId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Failed to fetch follow-ups:', error)
      return { data: [], error: error.message }
    }

    let items = (data as unknown as FollowUpWithLead[]) || []

    // Search filter across student name, phone, course interest, or note
    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim()
      items = items.filter((item) => {
        const studentName = item.lead?.full_name?.toLowerCase() || ''
        const phone = item.lead?.phone?.toLowerCase() || ''
        const course = item.lead?.course_interest?.toLowerCase() || ''
        const note = item.note.toLowerCase()
        return (
          studentName.includes(q) ||
          phone.includes(q) ||
          course.includes(q) ||
          note.includes(q)
        )
      })
    }

    return { data: items, error: null }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unexpected error loading follow-ups.'
    return { data: [], error: msg }
  }
}

/**
 * Fetch counts for each tab (Overdue, Today, Upcoming, Completed)
 */
export async function fetchFollowUpCounts(
  counsellorId?: string
): Promise<{ data: FollowUpCounts; error: string | null }> {
  if (!supabase) {
    return {
      data: { overdue: 0, today: 0, upcoming: 0, completed: 0, totalPending: 0 },
      error: 'Database client is not configured.',
    }
  }

  try {
    let query = supabase
      .from('follow_ups')
      .select('id, status, due_at, assigned_to')

    if (counsellorId && counsellorId !== 'all') {
      query = query.eq('assigned_to', counsellorId)
    }

    const { data, error } = await query

    if (error) {
      return {
        data: { overdue: 0, today: 0, upcoming: 0, completed: 0, totalPending: 0 },
        error: error.message,
      }
    }

    const now = new Date()
    const nowTime = now.getTime()
    const startOfTodayTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime()
    const endOfTodayTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime()

    let overdue = 0
    let today = 0
    let upcoming = 0
    let completed = 0
    let totalPending = 0

    const list = data || []
    for (const item of list) {
      if (item.status === 'completed') {
        completed++
        continue
      }

      if (item.status === 'pending') {
        totalPending++
        const dueTime = new Date(item.due_at).getTime()
        if (dueTime < nowTime) {
          overdue++
        } else if (dueTime >= startOfTodayTime && dueTime <= endOfTodayTime) {
          today++
        } else if (dueTime > endOfTodayTime) {
          upcoming++
        }
      }
    }

    return {
      data: { overdue, today, upcoming, completed, totalPending },
      error: null,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch follow-up counts.'
    return {
      data: { overdue: 0, today: 0, upcoming: 0, completed: 0, totalPending: 0 },
      error: msg,
    }
  }
}

/**
 * Schedule a new follow-up and create audit log
 */
export async function scheduleFollowUp(
  params: {
    lead_id: string
    due_at: string
    note: string
    assigned_to?: string | null
  },
  actorId: string
): Promise<{ data: FollowUpWithLead | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: 'Database client is not configured.' }
  }

  try {
    if (!params.lead_id) {
      return { data: null, error: 'Please select a student enquiry.' }
    }
    if (!params.due_at) {
      return { data: null, error: 'Please specify a follow-up due date and time.' }
    }
    if (!params.note || params.note.trim().length < 2) {
      return { data: null, error: 'Please provide a brief follow-up note or objective.' }
    }

    const insertPayload: FollowUpInsert = {
      lead_id: params.lead_id,
      due_at: params.due_at,
      note: params.note.trim(),
      assigned_to: params.assigned_to || null,
      created_by: actorId || null,
      status: 'pending',
    }

    const { data, error } = await supabase
      .from('follow_ups')
      .insert(insertPayload)
      .select(`
        *,
        lead:leads(id, full_name, phone, course_interest, status, assigned_to),
        assignee:profiles!follow_ups_assigned_to_fkey(id, full_name, role)
      `)
      .single()

    if (error) {
      console.error('Failed to schedule follow-up:', error)
      return { data: null, error: error.message }
    }

    // Activity log entry
    const formattedDate = new Date(params.due_at).toLocaleString()
    const activityPayload: ActivityInsert = {
      lead_id: params.lead_id,
      actor_id: actorId || null,
      activity_type: 'follow_up_scheduled',
      description: `Follow-up callback scheduled for ${formattedDate}`,
      metadata: {
        due_at: params.due_at,
        note: params.note.trim(),
        assigned_to: params.assigned_to || null,
      },
    }

    await supabase.from('activities').insert(activityPayload)

    return { data: data as unknown as FollowUpWithLead, error: null }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to schedule follow-up.'
    return { data: null, error: msg }
  }
}

/**
 * Mark a follow-up completed with an outcome note
 */
export async function completeFollowUp(
  followUpId: string,
  outcomeNote: string,
  actorId: string,
  leadId: string
): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: 'Database client is not configured.' }
  }

  try {
    const completedAt = new Date().toISOString()

    const { error: updateError } = await supabase
      .from('follow_ups')
      .update({
        status: 'completed',
        completed_at: completedAt,
      })
      .eq('id', followUpId)

    if (updateError) {
      console.error('Failed to complete follow-up:', updateError)
      return { error: updateError.message }
    }

    // Activity log entry
    const cleanOutcome = outcomeNote.trim()
    const activityPayload: ActivityInsert = {
      lead_id: leadId,
      actor_id: actorId || null,
      activity_type: 'follow_up_completed',
      description: cleanOutcome
        ? `Completed follow-up: "${cleanOutcome}"`
        : 'Completed scheduled follow-up callback',
      metadata: {
        follow_up_id: followUpId,
        outcome_note: cleanOutcome || null,
        completed_at: completedAt,
      },
    }

    await supabase.from('activities').insert(activityPayload)

    return { error: null }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to complete follow-up.'
    return { error: msg }
  }
}

/**
 * Reschedule a follow-up with new date/time and optional reason
 */
export async function rescheduleFollowUp(
  followUpId: string,
  newDueAt: string,
  reason: string,
  actorId: string,
  leadId: string
): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: 'Database client is not configured.' }
  }

  try {
    if (!newDueAt) {
      return { error: 'Please choose a new due date and time.' }
    }

    const { error: updateError } = await supabase
      .from('follow_ups')
      .update({
        due_at: newDueAt,
      })
      .eq('id', followUpId)

    if (updateError) {
      console.error('Failed to reschedule follow-up:', updateError)
      return { error: updateError.message }
    }

    const formattedDate = new Date(newDueAt).toLocaleString()
    const cleanReason = reason.trim()

    // Activity log entry
    const activityPayload: ActivityInsert = {
      lead_id: leadId,
      actor_id: actorId || null,
      activity_type: 'follow_up_scheduled',
      description: cleanReason
        ? `Rescheduled callback to ${formattedDate} (${cleanReason})`
        : `Rescheduled callback to ${formattedDate}`,
      metadata: {
        follow_up_id: followUpId,
        new_due_at: newDueAt,
        reason: cleanReason || null,
      },
    }

    await supabase.from('activities').insert(activityPayload)

    return { error: null }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to reschedule follow-up.'
    return { error: msg }
  }
}
