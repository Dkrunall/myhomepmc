-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.society_registrations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feasibility_reports     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications           ENABLE ROW LEVEL SECURITY;

-- ── profiles ─────────────────────────────────────────────────────────────────

-- Any authenticated user can read any profile (needed for admin joins)
CREATE POLICY "profiles: authenticated can read all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can only update their own profile
CREATE POLICY "profiles: users update own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Insert is handled by the trigger; block direct inserts from clients
CREATE POLICY "profiles: no direct insert"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- ── society_registrations ────────────────────────────────────────────────────

-- Users see only their own; admins see all
CREATE POLICY "registrations: select own or admin"
  ON public.society_registrations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Users can submit their own registration
CREATE POLICY "registrations: users insert own"
  ON public.society_registrations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can edit their own if still within edit window; admins can update any
CREATE POLICY "registrations: update own (in window) or admin"
  ON public.society_registrations FOR UPDATE
  TO authenticated
  USING (
    (user_id = auth.uid() AND (can_edit_until IS NULL OR can_edit_until > now()))
    OR public.is_admin()
  )
  WITH CHECK (
    (user_id = auth.uid() AND (can_edit_until IS NULL OR can_edit_until > now()))
    OR public.is_admin()
  );

-- Only admins can delete registrations
CREATE POLICY "registrations: admins delete"
  ON public.society_registrations FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ── feasibility_reports ──────────────────────────────────────────────────────

-- Users see their own reports; admins see all
CREATE POLICY "reports: select own or admin"
  ON public.feasibility_reports FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Only admins can send (insert) reports
CREATE POLICY "reports: admins insert"
  ON public.feasibility_reports FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- ── leads ────────────────────────────────────────────────────────────────────

-- Admins can read all leads
CREATE POLICY "leads: admins select all"
  ON public.leads FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Admins can update lead status
CREATE POLICY "leads: admins update"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Public insert is handled by the API route using the service-role key,
-- which bypasses RLS. Authenticated users cannot insert directly.
-- Admins can insert (for manual lead creation from the admin panel)
CREATE POLICY "leads: admins insert"
  ON public.leads FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- ── notifications ─────────────────────────────────────────────────────────────

-- Users see their own; admins see all
CREATE POLICY "notifications: select own or admin"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Admins create notifications (e.g. on status change or report sent)
CREATE POLICY "notifications: admins insert"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Users can mark their own notifications as read
CREATE POLICY "notifications: users update own"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
