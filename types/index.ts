export type RegistrationStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'converted'
  | 'closed'

export type UserRole = 'admin' | 'user'

export interface Profile {
  id: string
  full_name: string | null
  mobile: string | null
  email?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface SocietyRegistration {
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
  status: RegistrationStatus
  admin_notes: string | null
  can_edit_until: string | null
  submitted_at: string
  updated_at: string
}

export interface FeasibilityReport {
  id: string
  registration_id: string
  user_id: string
  sent_by: string
  report_url: string
  cover_message: string
  sent_at: string
}

export interface Lead {
  id: string
  name: string
  email: string
  mobile: string
  project_type: string | null
  budget_range: string | null
  location: string | null
  message: string | null
  status: LeadStatus
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'status_changed' | 'report_received' | 'general'
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export interface AdminStats {
  totalRegistrations: number
  pendingReview: number
  reportsSent: number
  activeLeads: number
}
