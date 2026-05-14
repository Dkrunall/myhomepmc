-- ─────────────────────────────────────────────────────────────────────────────
-- Core tables
-- ─────────────────────────────────────────────────────────────────────────────

-- profiles: one row per auth user, created automatically by trigger
CREATE TABLE public.profiles (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   text,
  mobile      text,
  role        public.user_role NOT NULL DEFAULT 'user',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- society_registrations: one active registration per user
CREATE TABLE public.society_registrations (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  society_name          text        NOT NULL,
  root_area             numeric     NOT NULL CHECK (root_area > 0),
  no_of_rooms           integer     NOT NULL CHECK (no_of_rooms > 0),
  road_width            numeric     NOT NULL CHECK (road_width > 0),
  restriction_of_laws   boolean     NOT NULL DEFAULT false,
  restriction_notes     text,
  build_plan_url        text,
  plain_table_survey_url text,
  assured_plan_url      text,
  status                public.registration_status NOT NULL DEFAULT 'submitted',
  admin_notes           text,
  can_edit_until        timestamptz,
  submitted_at          timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- feasibility_reports: sent by admin to a registered user
CREATE TABLE public.feasibility_reports (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id  uuid        NOT NULL REFERENCES public.society_registrations(id) ON DELETE CASCADE,
  user_id          uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sent_by          uuid        NOT NULL REFERENCES public.profiles(id),
  report_url       text        NOT NULL,
  cover_message    text        NOT NULL,
  sent_at          timestamptz NOT NULL DEFAULT now()
);

-- leads: enquiries from the public landing page
CREATE TABLE public.leads (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  email         text        NOT NULL,
  mobile        text        NOT NULL,
  project_type  text,
  budget_range  text,
  location      text,
  message       text,
  status        public.lead_status NOT NULL DEFAULT 'new',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- notifications: in-app alerts for users
CREATE TABLE public.notifications (
  id         uuid                    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid                    NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       public.notification_type NOT NULL DEFAULT 'general',
  title      text                    NOT NULL,
  message    text                    NOT NULL,
  is_read    boolean                 NOT NULL DEFAULT false,
  created_at timestamptz             NOT NULL DEFAULT now()
);
