-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes for query performance
-- ─────────────────────────────────────────────────────────────────────────────

-- society_registrations: most queries filter by user or status
CREATE INDEX idx_registrations_user_id
  ON public.society_registrations (user_id);

CREATE INDEX idx_registrations_status
  ON public.society_registrations (status);

CREATE INDEX idx_registrations_submitted_at
  ON public.society_registrations (submitted_at DESC);

-- feasibility_reports: user inbox and admin send history
CREATE INDEX idx_reports_user_id
  ON public.feasibility_reports (user_id);

CREATE INDEX idx_reports_registration_id
  ON public.feasibility_reports (registration_id);

CREATE INDEX idx_reports_sent_at
  ON public.feasibility_reports (sent_at DESC);

-- leads: admin dashboard filters by status
CREATE INDEX idx_leads_status
  ON public.leads (status);

CREATE INDEX idx_leads_created_at
  ON public.leads (created_at DESC);

-- notifications: user notification feed and unread count
CREATE INDEX idx_notifications_user_id
  ON public.notifications (user_id);

CREATE INDEX idx_notifications_user_unread
  ON public.notifications (user_id, is_read)
  WHERE is_read = false;

CREATE INDEX idx_notifications_created_at
  ON public.notifications (created_at DESC);
