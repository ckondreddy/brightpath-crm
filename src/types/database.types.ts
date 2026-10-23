export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          role: 'admin' | 'manager' | 'counsellor'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          role?: 'admin' | 'manager' | 'counsellor'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          role?: 'admin' | 'manager' | 'counsellor'
          created_at?: string
          updated_at?: string
        }
        Relationships: {
          foreignKeyName: string
          columns: string[]
          isOneToOne?: boolean
          referencedRelation: string
          referencedColumns: string[]
        }[]
      }
      leads: {
        Row: {
          id: string
          full_name: string
          email: string | null
          phone: string
          course_interest: string
          source: string
          status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'
          lost_reason: string | null
          assigned_to: string | null
          created_by: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email?: string | null
          phone: string
          course_interest: string
          source: string
          status?: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'
          lost_reason?: string | null
          assigned_to?: string | null
          created_by?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string | null
          phone?: string
          course_interest?: string
          source?: string
          status?: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'
          lost_reason?: string | null
          assigned_to?: string | null
          created_by?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: {
          foreignKeyName: string
          columns: string[]
          isOneToOne?: boolean
          referencedRelation: string
          referencedColumns: string[]
        }[]
      }
      follow_ups: {
        Row: {
          id: string
          lead_id: string
          assigned_to: string | null
          due_at: string
          note: string
          status: 'pending' | 'completed' | 'cancelled'
          completed_at: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          assigned_to?: string | null
          due_at: string
          note: string
          status?: 'pending' | 'completed' | 'cancelled'
          completed_at?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          assigned_to?: string | null
          due_at?: string
          note?: string
          status?: 'pending' | 'completed' | 'cancelled'
          completed_at?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: {
          foreignKeyName: string
          columns: string[]
          isOneToOne?: boolean
          referencedRelation: string
          referencedColumns: string[]
        }[]
      }
      activities: {
        Row: {
          id: string
          lead_id: string
          actor_id: string | null
          activity_type: 'lead_created' | 'status_updated' | 'note_added' | 'follow_up_scheduled' | 'follow_up_completed' | 'lead_edited'
          description: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          actor_id?: string | null
          activity_type: 'lead_created' | 'status_updated' | 'note_added' | 'follow_up_scheduled' | 'follow_up_completed' | 'lead_edited'
          description: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          actor_id?: string | null
          activity_type?: 'lead_created' | 'status_updated' | 'note_added' | 'follow_up_scheduled' | 'follow_up_completed' | 'lead_edited'
          description?: string
          metadata?: Json
          created_at?: string
        }
        Relationships: {
          foreignKeyName: string
          columns: string[]
          isOneToOne?: boolean
          referencedRelation: string
          referencedColumns: string[]
        }[]
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_manager_or_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_current_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
  }
}
