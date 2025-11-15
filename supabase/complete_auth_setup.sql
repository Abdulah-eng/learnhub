-- ============================================
-- COMPLETE SUPABASE AUTHENTICATION SETUP
-- ============================================
-- Run this file in Supabase SQL Editor
-- This sets up the profiles table and triggers
-- ============================================

-- Step 1: Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Step 4: Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create trigger to automatically create profile when user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_profiles_updated_at();

-- ============================================
-- IMPORTANT: USER CREATION INSTRUCTIONS
-- ============================================
-- After running this SQL, you need to create users via Supabase Dashboard:
--
-- 1. Go to Authentication > Users > Add User
-- 2. Create each user with the following details:
--
-- ADMIN USER:
--   Email: admin@learnhub.com
--   Password: admin123
--   Auto Confirm User: ✅ (checked)
--   User Metadata (JSON):
--     {
--       "name": "Admin",
--       "role": "admin"
--     }
--
-- REGULAR USERS (repeat for each):
--   1. Email: john@example.com
--      Password: user123
--      Metadata: {"name": "John Smith", "role": "user"}
--
--   2. Email: sarah@example.com
--      Password: user123
--      Metadata: {"name": "Sarah Williams", "role": "user"}
--
--   3. Email: michael@example.com
--      Password: user123
--      Metadata: {"name": "Michael Brown", "role": "user"}
--
--   4. Email: emily@example.com
--      Password: user123
--      Metadata: {"name": "Emily Davis", "role": "user"}
--
--   5. Email: david@example.com
--      Password: user123
--      Metadata: {"name": "David Wilson", "role": "user"}
--
-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- After creating users, run this to verify:
-- SELECT id, email, name, role FROM profiles ORDER BY role, email;
-- ============================================

