-- ─────────────────────────────────────────────────────────────────────────────
-- Storage buckets
-- ─────────────────────────────────────────────────────────────────────────────

-- Private bucket for user-uploaded registration documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'registration-docs',
  'registration-docs',
  false,
  10485760,  -- 10 MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Private bucket for admin-uploaded feasibility reports
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'feasibility-reports',
  'feasibility-reports',
  false,
  10485760,  -- 10 MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Storage RLS policies — registration-docs
-- Files are stored as {user_id}/{filename}
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "reg-docs: users upload to own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'registration-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "reg-docs: users read own files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'registration-docs'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_admin()
    )
  );

CREATE POLICY "reg-docs: users delete own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'registration-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "reg-docs: admins read all"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'registration-docs'
    AND public.is_admin()
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- Storage RLS policies — feasibility-reports
-- Files are stored as {user_id}/{registration_id}-report-{timestamp}.ext
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "feasibility-reports: admins upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'feasibility-reports'
    AND public.is_admin()
  );

CREATE POLICY "feasibility-reports: users read own"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'feasibility-reports'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_admin()
    )
  );

CREATE POLICY "feasibility-reports: admins delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'feasibility-reports'
    AND public.is_admin()
  );
