export type UserRole = 'admin' | 'manager' | 'counsellor'

export interface UserProfile {
  id: string
  full_name: string
  role: UserRole
  created_at: string
  updated_at: string
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'

export type LeadSource =
  | 'Website'
  | 'Walk-in'
  | 'Phone'
  | 'Social Media'
  | 'Referral'
  | 'Other'

export interface Lead {
  id: string
  full_name: string
  email: string | null
  phone: string
  course_interest: string
  source: LeadSource
  status: LeadStatus
  lost_reason: string | null
  assigned_to: string | null
  created_by: string | null
  notes: string | null
  created_at: string
  updated_at: string
  // Joined fields for display
  assignee?: UserProfile | null
  creator?: UserProfile | null
}

export type FollowUpStatus = 'pending' | 'completed' | 'cancelled'

export interface FollowUp {
  id: string
  lead_id: string
  assigned_to: string | null
  due_at: string
  note: string
  status: FollowUpStatus
  completed_at: string | null
  created_by: string | null
  created_at: string
  // Joined fields for display
  lead?: Lead | null
  assignee?: UserProfile | null
}

export type ActivityType =
  | 'lead_created'
  | 'status_updated'
  | 'note_added'
  | 'follow_up_scheduled'
  | 'follow_up_completed'
  | 'lead_edited'

export interface Activity {
  id: string
  lead_id: string
  actor_id: string | null
  activity_type: ActivityType
  description: string
  metadata: Record<string, unknown>
  created_at: string
  // Joined actor profile
  actor?: UserProfile | null
}

export interface DashboardMetrics {
  totalLeads: number
  newLeads: number
  convertedLeads: number
  overdueFollowUps: number
  conversionRate: number
  leadsByStatus: Record<LeadStatus, number>
  leadsBySource: Record<string, number>
}
