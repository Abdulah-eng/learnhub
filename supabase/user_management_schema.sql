-- ============================================
-- USER MANAGEMENT SCHEMA UPDATES
-- ============================================
-- Run this file in Supabase SQL Editor
-- This adds is_approved and is_blocked fields to profiles table
-- ============================================
-- add new fields to profiles table
-- Add is_approved field (defaults to false for new signups, requires admin approval)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add is_blocked field (defaults to false, allows admin to block/unblock users)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;

-- Update existing users to be approved (so they don't get locked out)
UPDATE profiles SET is_approved = true WHERE is_approved IS NULL OR is_approved = false;

-- Update existing users to not be blocked
UPDATE profiles SET is_blocked = false WHERE is_blocked IS NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_approved ON profiles(is_approved);
CREATE INDEX IF NOT EXISTS idx_profiles_is_blocked ON profiles(is_blocked);

-- Create a function to check if user is admin (bypasses RLS to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Add policy to allow admins to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Add policy to allow admins to update all profiles
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Update the handle_new_user function to set is_approved to false for new signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, is_approved, is_blocked)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    false, -- New signups require approval
    false  -- New signups are not blocked
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

