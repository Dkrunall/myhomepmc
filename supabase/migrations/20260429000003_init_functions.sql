-- ─────────────────────────────────────────────────────────────────────────────
-- Helper function: check if the calling user is an admin
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Trigger function: keep updated_at current
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_society_registrations_updated_at
  BEFORE UPDATE ON public.society_registrations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Trigger function: auto-create profile row when a user signs up
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- Trigger function: set can_edit_until to 48 h after submission
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_registration_submitted()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.can_edit_until IS NULL THEN
    NEW.can_edit_until = now() + interval '48 hours';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_registration_set_edit_window
  BEFORE INSERT ON public.society_registrations
  FOR EACH ROW EXECUTE FUNCTION public.handle_registration_submitted();
