-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text DEFAULT 'member'::text CHECK (role = ANY (ARRAY['member'::text, 'admin'::text, 'super_admin'::text])),
  approved boolean DEFAULT false,
  department text,
  series text,
  photo text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.members (
  id uuid NOT NULL,
  name text NOT NULL,
  position text DEFAULT 'Member'::text,
  role text,
  department text,
  series text,
  email text,
  phone text,
  location text,
  avatar text,
  join_date date DEFAULT CURRENT_DATE,
  bio text,
  is_alumni boolean DEFAULT false,
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT members_pkey PRIMARY KEY (id)
);
CREATE TABLE public.gallery (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text,
  type text CHECK (type = ANY (ARRAY['image'::text, 'video'::text])),
  url text NOT NULL,
  thumbnail text,
  uploaded_by uuid,
  approved boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  description text,
  tags ARRAY,
  CONSTRAINT gallery_pkey PRIMARY KEY (id),
  CONSTRAINT gallery_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_time timestamp without time zone,
  end_time timestamp without time zone,
  location text,
  created_by uuid,
  created_at timestamp without time zone DEFAULT now(),
  approved boolean DEFAULT false,
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.activities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image text,
  description text,
  schedule text,
  duration text,
  level text,
  active boolean DEFAULT true,
  CONSTRAINT activities_pkey PRIMARY KEY (id)
);
CREATE TABLE public.donations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  payment_method text NOT NULL CHECK (payment_method = ANY (ARRAY['Bkash'::text, 'Nagad'::text, 'BankAccount'::text, 'Cash'::text])),
  transaction_id text NOT NULL UNIQUE,
  email text,
  phone text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text])),
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT donations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.test (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  msg character varying,
  CONSTRAINT test_pkey PRIMARY KEY (id)
);