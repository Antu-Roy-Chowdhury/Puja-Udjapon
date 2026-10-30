-- 1. Export Supabase auth users with scripts/export-supabase-auth.sql.
-- 2. Load that CSV into this staging table in Neon.
-- 3. Run this file before importing public table data.
BEGIN;

CREATE TABLE IF NOT EXISTS _supabase_auth_users_import (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  encrypted_password text,
  email_confirmed_at timestamptz,
  raw_user_meta_data jsonb,
  created_at timestamptz,
  updated_at timestamptz
);

INSERT INTO users (id, email, password_hash, email_confirmed_at, created_at, updated_at)
SELECT id, lower(email), NULLIF(encrypted_password, ''), email_confirmed_at,
  COALESCE(created_at, now()), COALESCE(updated_at, created_at, now())
FROM _supabase_auth_users_import
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  updated_at = EXCLUDED.updated_at;

COMMIT;
