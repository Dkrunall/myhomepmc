import { z } from 'zod'

export const sendReportSchema = z.object({
  user_id: z.string().min(1, 'Please select a user'),
  registration_id: z.string().min(1, 'No registration found for this user'),
  cover_message: z
    .string()
    .min(20, 'Cover message must be at least 20 characters')
    .max(2000, 'Cover message must be under 2000 characters'),
})

export type SendReportFormData = z.infer<typeof sendReportSchema>

export const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  mobile: z.string().min(10, 'Mobile number is required'),
  project_type: z.string().optional(),
  budget_range: z.string().optional(),
  location: z.string().optional(),
  message: z.string().optional(),
})

export type LeadFormData = z.infer<typeof leadSchema>

export const societyRegistrationSchema = z.object({
  society_name: z.string().min(2, 'Society name is required'),
  root_area: z.number().positive('Plot area must be positive'),
  no_of_rooms: z.number().int().positive('Number of rooms must be positive'),
  road_width: z.number().positive('Road width must be positive'),
  restriction_of_laws: z.boolean().default(false),
  restriction_notes: z.string().optional(),
})

export type SocietyRegistrationFormData = z.infer<typeof societyRegistrationSchema>
