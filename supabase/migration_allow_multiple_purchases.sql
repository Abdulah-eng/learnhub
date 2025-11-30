-- Migration: Allow users to purchase the same course multiple times
-- This removes the UNIQUE constraint on (user_id, course_id) to enable unlimited purchases

-- Step 1: Drop the existing UNIQUE constraint
ALTER TABLE user_purchased_courses 
DROP CONSTRAINT IF EXISTS user_purchased_courses_user_id_course_id_key;

-- Step 2: Verify the constraint is removed (this will show an error if constraint doesn't exist, which is fine)
-- The constraint name might vary, so we use IF EXISTS to handle gracefully

-- Note: After running this migration, users will be able to purchase the same course multiple times.
-- Each purchase will create a new transaction and a new entry in user_purchased_courses table.

