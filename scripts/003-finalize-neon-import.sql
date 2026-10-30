-- Run after importing public.profiles, members, gallery, events, activities,
-- donations, and test data into the matching Neon tables.
BEGIN;

UPDATE profiles p
SET contact = COALESCE(p.contact, a.raw_user_meta_data->>'contact'),
    blood_group = COALESCE(p.blood_group, a.raw_user_meta_data->>'bloodGroup'),
    bio = COALESCE(p.bio, a.raw_user_meta_data->>'bio'),
    photo = COALESCE(p.photo, a.raw_user_meta_data->>'photo')
FROM _supabase_auth_users_import a
WHERE a.id = p.id;

UPDATE members m
SET profile_id = p.id
FROM profiles p
WHERE m.profile_id IS NULL AND m.id = p.id;

INSERT INTO members (id, profile_id, name, position, role, department, series, email, phone, avatar, bio, join_date, is_alumni)
SELECT p.id, p.id, p.name, 'Member', p.role, p.department, p.series, p.email,
  p.contact, p.photo, p.bio, p.created_at::date,
  CASE WHEN p.series ~ '^\d{4}$' THEN p.series::integer <= 2019 ELSE false END
FROM profiles p
WHERE p.approved = true
ON CONFLICT (id) DO UPDATE SET
  profile_id = EXCLUDED.profile_id,
  role = EXCLUDED.role,
  email = EXCLUDED.email,
  phone = COALESCE(members.phone, EXCLUDED.phone),
  avatar = COALESCE(members.avatar, EXCLUDED.avatar),
  bio = COALESCE(members.bio, EXCLUDED.bio);

UPDATE donations SET payment_method = CASE payment_method
  WHEN 'bKash' THEN 'bkash' WHEN 'Bkash' THEN 'bkash'
  WHEN 'Nagad' THEN 'nagad'
  WHEN 'BankTransfer' THEN 'bank_transfer' WHEN 'BankAccount' THEN 'bank_transfer'
  WHEN 'Cash' THEN 'cash'
  ELSE payment_method END;

ALTER TABLE donations DROP CONSTRAINT IF EXISTS donations_payment_method_check;
ALTER TABLE donations ADD CONSTRAINT donations_payment_method_check
  CHECK (payment_method IN ('bkash', 'nagad', 'bank_transfer', 'cash'));

INSERT INTO committees (year, title, description)
SELECT EXTRACT(YEAR FROM CURRENT_DATE)::integer,
  EXTRACT(YEAR FROM CURRENT_DATE)::integer || ' Committee',
  'Committee migrated from the previous current-committee member list'
WHERE EXISTS (
  SELECT 1 FROM members WHERE is_alumni = false AND COALESCE(position, 'Member') <> 'Member'
)
ON CONFLICT (year) DO NOTHING;

INSERT INTO committee_members (committee_id, member_id, position, display_order)
SELECT c.id, m.id, COALESCE(m.position, 'Committee Member'),
  ROW_NUMBER() OVER (ORDER BY m.position, m.name)::integer
FROM committees c
JOIN members m ON m.is_alumni = false AND COALESCE(m.position, 'Member') <> 'Member'
WHERE c.year = EXTRACT(YEAR FROM CURRENT_DATE)::integer
ON CONFLICT (committee_id, member_id) DO NOTHING;

COMMIT;
