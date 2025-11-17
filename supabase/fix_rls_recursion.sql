-- ============================================
-- FIX RLS INFINITE RECURSION
-- ============================================
-- Run this file in Supabase SQL Editor
-- This fixes the infinite recursion error in profiles RLS policies
-- ============================================

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

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Recreate policies using the function (avoids recursion)
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon;

