-- Apply after 001-neon-schema.sql. Existing rows are preserved.
BEGIN;

CREATE TABLE IF NOT EXISTS homepage_settings (
  id integer PRIMARY KEY CHECK (id = 1),
  draft jsonb NOT NULL DEFAULT '{}'::jsonb,
  published jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

CREATE TABLE IF NOT EXISTS developer_profiles (
  profile_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  designation text NOT NULL DEFAULT 'Developer',
  contribution text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  is_founder boolean NOT NULL DEFAULT false,
  updated_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS developer_single_founder_idx
  ON developer_profiles (is_founder) WHERE is_founder = true;

-- Reserve the founder designation only when the owner's approved profile exists.
INSERT INTO developer_profiles (profile_id, designation, contribution, is_founder)
SELECT id, 'Founder / Creator', 'Website creator', true
FROM profiles
WHERE lower(email::text) = 'anturoychowdhury3@gmail.com' AND approved = true
  AND NOT EXISTS (SELECT 1 FROM developer_profiles WHERE is_founder = true)
ON CONFLICT (profile_id) DO NOTHING;

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_id uuid,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE committees ADD COLUMN IF NOT EXISTS term_start date;
ALTER TABLE committees ADD COLUMN IF NOT EXISTS term_end date;
ALTER TABLE committees DROP CONSTRAINT IF EXISTS committees_term_dates_check;
ALTER TABLE committees ADD CONSTRAINT committees_term_dates_check
  CHECK (term_start IS NULL OR term_end IS NULL OR term_end >= term_start);

-- Resolve any legacy duplicate member emails before applying this index.
CREATE UNIQUE INDEX IF NOT EXISTS members_email_unique_idx
  ON members (email) WHERE email IS NOT NULL;

COMMIT;
