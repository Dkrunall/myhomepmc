-- ─────────────────────────────────────────────────────────────────────────────
-- Custom enum types
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TYPE public.user_role AS ENUM ('admin', 'user');

CREATE TYPE public.registration_status AS ENUM (
  'submitted',
  'under_review',
  'approved',
  'rejected'
);

CREATE TYPE public.lead_status AS ENUM (
  'new',
  'contacted',
  'converted',
  'closed'
);

CREATE TYPE public.notification_type AS ENUM (
  'status_changed',
  'report_received',
  'general'
);
