# Multiple Purchases Setup

This guide explains how to enable unlimited purchases of the same course by a single user.

## Overview

By default, the database has a UNIQUE constraint on `(user_id, course_id)` in the `user_purchased_courses` table, which prevents a user from purchasing the same course multiple times. This migration removes that constraint to allow unlimited purchases.

## Migration Steps

1. **Run the Migration SQL**
   - Go to your Supabase Dashboard
   - Navigate to SQL Editor
   - Run the `supabase/migration_allow_multiple_purchases.sql` file
   - This will remove the UNIQUE constraint on `(user_id, course_id)`

2. **Verify the Migration**
   - Check that the constraint has been removed
   - You can verify by running:
     ```sql
     SELECT constraint_name, constraint_type 
     FROM information_schema.table_constraints 
     WHERE table_name = 'user_purchased_courses' 
     AND constraint_type = 'UNIQUE';
     ```
   - This should return no rows (or only the primary key constraint)

## How It Works

After the migration:

1. **Multiple Purchases**: Users can now purchase the same course unlimited times
2. **Each Purchase Creates**:
   - A new transaction record in the `transactions` table
   - A new entry in the `user_purchased_courses` table
3. **UI Behavior**:
   - The "Owned" badge will still show if the user has purchased the course at least once
   - The purchase button will always be available, even for already-purchased courses
   - The button text changes to "Purchase Again" for courses already owned

## Database Schema

The `user_purchased_courses` table structure remains the same:
- `id` - UUID primary key
- `user_id` - References auth.users
- `course_id` - References courses table
- `transaction_id` - References transactions table
- `purchased_at` - Timestamp

The only change is the removal of the UNIQUE constraint on `(user_id, course_id)`.

## Code Changes

The following code changes have been made:

1. **`lib/supabase/users.ts`**:
   - `addPurchasedCourse()` now always inserts a new record instead of checking for existing purchases

2. **`components/CourseDetail.tsx`**:
   - Purchase button is always visible, even for already-purchased courses
   - Button text changes to "Purchase Again" for owned courses
   - Added informational message when course is already owned

## Testing

After running the migration, test the following:

1. Purchase a course for the first time
2. Purchase the same course again (should create a new transaction)
3. Verify both transactions appear in the dashboard
4. Verify the course shows as "Owned" but still allows purchasing again

## Notes

- All existing functionality remains intact
- Users can still view their purchased courses
- Transaction history will show all purchases, including multiple purchases of the same course
- The `getUserPurchasedCourses()` function will return all course IDs (including duplicates), which is fine for UI purposes

