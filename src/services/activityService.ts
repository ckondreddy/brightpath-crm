import { supabase } from '../lib/supabaseClient'
import { Database } from '../types/database.types'
import { ActivityWithActor } from './leadService'

type ActivityInsert = Database['public']['Tables']['activities']['Insert']

/**
 * Fetch all chronological activities for a given lead
 */
export async function fetchLeadActivities(
  leadId: string
): Promise<{ data: ActivityWithActor[]; error: string | null }> {
  if (!supabase) {
    return { data: [], error: 'Database client is not configured.' }
  }

  try {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        actor:profiles!activities_actor_id_fkey(id, full_name, role)
      `)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch lead activities:', error)
      return { data: [], error: error.message }
    }

    return { data: (data as unknown as ActivityWithActor[]) || [], error: null }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unexpected error loading activities.'
    return { data: [], error: msg }
  }
}

/**
 * Add a consultation / counsellor note to the activity log and update lead notes
 */
export async function addLeadNote(
  leadId: string,
  noteText: string,
  actorId: string
): Promise<{ data: ActivityWithActor | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: 'Database client is not configured.' }
  }

  const cleanNote = noteText.trim()
  if (!cleanNote || cleanNote.length < 2) {
    return { data: null, error: 'Please enter a note of at least 2 characters.' }
  }

  try {
    // 1. Insert into activities
    const activityPayload: ActivityInsert = {
      lead_id: leadId,
      actor_id: actorId || null,
      activity_type: 'note_added',
      description: cleanNote,
      metadata: {
        note: cleanNote,
        logged_at: new Date().toISOString(),
      },
    }

    const { data: actData, error: actError } = await supabase
      .from('activities')
      .insert(activityPayload)
      .select(`
        *,
        actor:profiles!activities_actor_id_fkey(id, full_name, role)
      `)
      .single()

    if (actError) {
      console.error('Failed to log note activity:', actError)
      return { data: null, error: actError.message }
    }

    // 2. Also update lead updated_at timestamp
    await supabase
      .from('leads')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', leadId)

    return { data: actData as unknown as ActivityWithActor, error: null }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to add consultation note.'
    return { data: null, error: msg }
  }
}
