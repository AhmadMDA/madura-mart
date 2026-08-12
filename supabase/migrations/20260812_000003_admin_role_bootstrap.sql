-- Run this in the Supabase SQL Editor after the auth tables exist.
-- Replace the example emails with the emails you created in Supabase Auth.

-- 1) See the real auth user IDs that exist in the project.
SELECT id, email, created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 20;

-- 2) Promote an existing email to admin.
WITH admin_user AS (
  SELECT id
  FROM auth.users
  WHERE email = 'admin@maduramart.test'
)
INSERT INTO public.profiles (id, full_name, username, role)
SELECT
  au.id,
  'Admin Madura Mart',
  'adminmaduramart',
  'admin'
FROM admin_user au
ON CONFLICT (id) DO UPDATE
SET full_name = EXCLUDED.full_name,
    username = EXCLUDED.username,
    role = 'admin',
    updated_at = now();

UPDATE public.profiles
SET role = 'admin', updated_at = now()
WHERE id IN (
  SELECT id
  FROM auth.users
  WHERE email = 'admin@maduramart.test'
);

-- 3) Create or upgrade a customer user for testing.
WITH customer_user AS (
  SELECT id
  FROM auth.users
  WHERE email = 'customer@maduramart.test'
)
INSERT INTO public.profiles (id, full_name, username, role)
SELECT
  cu.id,
  'Customer Madura Mart',
  'customermart',
  'customer'
FROM customer_user cu
ON CONFLICT (id) DO UPDATE
SET full_name = EXCLUDED.full_name,
    username = EXCLUDED.username,
    role = 'customer',
    updated_at = now();

-- 4) Quick verification query.
SELECT p.id, au.email, p.full_name, p.username, p.role
FROM public.profiles p
JOIN auth.users au ON au.id = p.id
WHERE au.email IN ('admin@maduramart.test', 'customer@maduramart.test');

-- 5) Optional: if you want to create a new test user directly from the SQL editor,
-- use Supabase Auth first in the dashboard and then run the query above.
