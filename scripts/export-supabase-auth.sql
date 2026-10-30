-- Run in Supabase, then export the result as CSV with headers.
SELECT
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
FROM auth.users
ORDER BY created_at;
