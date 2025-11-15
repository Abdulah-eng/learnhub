-- This SQL file contains queries to update user roles after creating users
-- IMPORTANT: Users must be created first via Supabase Dashboard or Admin API
-- Then run these UPDATE queries to set their roles

-- Set admin role
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@learnhub.com';

-- Set user roles for regular users
UPDATE profiles 
SET role = 'user' 
WHERE email IN (
  'john@example.com',
  'sarah@example.com',
  'michael@example.com',
  'emily@example.com',
  'david@example.com'
);

-- Verify the roles were set correctly
SELECT id, email, name, role FROM profiles ORDER BY role, email;

