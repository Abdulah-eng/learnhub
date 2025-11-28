-- ============================================
-- ADMIN COURSES MANAGEMENT PERMISSIONS
-- ============================================
-- Run this in Supabase SQL Editor
-- This ensures admins can update courses
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

-- Add policy to allow admins to update courses
DROP POLICY IF EXISTS "Admins can update courses" ON courses;
CREATE POLICY "Admins can update courses" ON courses
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Add policy to allow admins to view all courses (if not already exists)
DROP POLICY IF EXISTS "Admins can view all courses" ON courses;
CREATE POLICY "Admins can view all courses" ON courses
  FOR SELECT
  USING (public.is_admin(auth.uid()) OR true); -- Allow all to view, but admins have explicit permission

-- Note: The API route uses service role key which bypasses RLS,
-- so these policies are mainly for direct database access.
-- The service role key in the API route ensures admin operations work correctly.

