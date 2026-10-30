-- Neon PostgreSQL target schema for RUET Puja Udjapon.
-- Run on an empty Neon database before importing data.
BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext NOT NULL UNIQUE,
  password_hash text,
  email_confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email citext NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin', 'super_admin')),
  approved boolean NOT NULL DEFAULT false,
  department text,
  series text,
  photo text,
  contact text,
  blood_group text,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  position text NOT NULL DEFAULT 'Member',
  role text CHECK (role IS NULL OR role IN ('member', 'admin', 'super_admin')),
  department text,
  series text,
  email citext,
  phone text,
  location text,
  avatar text,
  join_date date DEFAULT CURRENT_DATE,
  bio text,
  is_alumni boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  type text CHECK (type IN ('image', 'video')),
  url text NOT NULL,
  thumbnail text,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  description text,
  tags text[] NOT NULL DEFAULT '{}'
);

CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_time timestamptz,
  end_time timestamptz,
  location text,
  image_url text,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  approved boolean NOT NULL DEFAULT false,
  CHECK (end_time IS NULL OR start_time IS NULL OR end_time >= start_time)
);

CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image text,
  description text,
  schedule text,
  duration text,
  level text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  payment_method text NOT NULL CHECK (payment_method IN (
    'bkash', 'bKash', 'Bkash', 'nagad', 'Nagad',
    'bank_transfer', 'BankTransfer', 'BankAccount', 'cash', 'Cash'
  )),
  transaction_id text NOT NULL UNIQUE,
  email citext,
  phone text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE committees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL UNIQUE CHECK (year BETWEEN 1900 AND 2200),
  title text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE committee_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id uuid NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  position text NOT NULL,
  display_order integer NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (committee_id, member_id)
);

CREATE TABLE sessions (
  token_hash char(64) PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE test (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  msg varchar
);

CREATE INDEX profiles_role_approved_idx ON profiles (role, approved);
CREATE INDEX members_directory_idx ON members (is_alumni, department, series);
CREATE INDEX gallery_approved_created_idx ON gallery (approved, created_at DESC);
CREATE INDEX events_start_time_idx ON events (start_time);
CREATE INDEX events_created_by_idx ON events (created_by);
CREATE INDEX donations_status_created_idx ON donations (status, created_at DESC);
CREATE INDEX committee_members_order_idx ON committee_members (committee_id, display_order);
CREATE INDEX sessions_user_id_idx ON sessions (user_id);
CREATE INDEX sessions_expires_at_idx ON sessions (expires_at);

COMMIT;
