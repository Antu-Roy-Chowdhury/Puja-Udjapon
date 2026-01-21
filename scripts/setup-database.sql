-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Fix profiles table with correct column names
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('member', 'admin', 'super_admin')) DEFAULT 'member',
  isApproved BOOLEAN DEFAULT FALSE,
  department TEXT,
  series TEXT,
  photo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Members table (public directory of approved members)
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position TEXT DEFAULT 'Member',
  role TEXT,
  department TEXT,
  series TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  avatar TEXT,
  join_date DATE DEFAULT CURRENT_DATE,
  bio TEXT,
  is_alumni BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Gallery table for photos and videos
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  type TEXT CHECK (type IN ('image','video')),
  url TEXT NOT NULL,
  thumbnail TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  isApproved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  description TEXT,
  tags TEXT[]
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  location TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Donations table with payment tracking
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  donor_email TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('bkash', 'nagad', 'bank_transfer', 'cash', 'other')),
  transaction_id TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for privacy

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- Gallery RLS
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved gallery"
  ON gallery FOR SELECT
  USING (isApproved = TRUE OR auth.uid() = uploaded_by);

CREATE POLICY "Users can upload their own gallery"
  ON gallery FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

-- Events RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (TRUE);

-- Donations RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view all donations"
  ON donations FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

CREATE POLICY "Anyone can create donation"
  ON donations FOR INSERT
  WITH CHECK (TRUE);
