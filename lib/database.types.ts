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
          full_name: string | null
          mobile: string | null
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          mobile?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          mobile?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      society_registrations: {
        Row: {
          id: string
          user_id: string
          society_name: string
          root_area: number
          no_of_rooms: number
          road_width: number
          restriction_of_laws: boolean
          restriction_notes: string | null
          build_plan_url: string | null
          plain_table_survey_url: string | null
          assured_plan_url: string | null
          status: 'submitted' | 'under_review' | 'approved' | 'rejected'
          admin_notes: string | null
          can_edit_until: string | null
          submitted_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          society_name: string
          root_area: number
          no_of_rooms: number
          road_width: number
          restriction_of_laws?: boolean
          restriction_notes?: string | null
          build_plan_url?: string | null
          plain_table_survey_url?: string | null
          assured_plan_url?: string | null
          status?: 'submitted' | 'under_review' | 'approved' | 'rejected'
          admin_notes?: string | null
          can_edit_until?: string | null
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          society_name?: string
          root_area?: number
          no_of_rooms?: number
          road_width?: number
          restriction_of_laws?: boolean
          restriction_notes?: string | null
          build_plan_url?: string | null
          plain_table_survey_url?: string | null
          assured_plan_url?: string | null
          status?: 'submitted' | 'under_review' | 'approved' | 'rejected'
          admin_notes?: string | null
          can_edit_until?: string | null
          submitted_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      feasibility_reports: {
        Row: {
          id: string
          registration_id: string
          user_id: string
          sent_by: string
          report_url: string
          cover_message: string
          sent_at: string
        }
        Insert: {
          id?: string
          registration_id: string
          user_id: string
          sent_by: string
          report_url: string
          cover_message: string
          sent_at?: string
        }
        Update: {
          id?: string
          registration_id?: string
          user_id?: string
          sent_by?: string
          report_url?: string
          cover_message?: string
          sent_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string
          mobile: string
          project_type: string | null
          budget_range: string | null
          location: string | null
          message: string | null
          status: 'new' | 'contacted' | 'converted' | 'closed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          mobile: string
          project_type?: string | null
          budget_range?: string | null
          location?: string | null
          message?: string | null
          status?: 'new' | 'contacted' | 'converted' | 'closed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          mobile?: string
          project_type?: string | null
          budget_range?: string | null
          location?: string | null
          message?: string | null
          status?: 'new' | 'contacted' | 'converted' | 'closed'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'status_changed' | 'report_received' | 'general'
          title: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'status_changed' | 'report_received' | 'general'
          title: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'status_changed' | 'report_received' | 'general'
          title?: string
          message?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
