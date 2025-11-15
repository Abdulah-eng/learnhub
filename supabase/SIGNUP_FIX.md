# Signup RLS Fix - Setup Instructions

This guide will fix the Row Level Security (RLS) errors preventing user signup.

## Step 1: Run the RLS Fix SQL

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **"New query"**
4. Open the `supabase/fix_profiles_rls.sql` file
5. Copy the entire contents and paste into the SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)

This will:
- Add an INSERT policy allowing users to create their own profile
- Add a SELECT policy allowing profiles to be viewable (for admin dashboard)
- Ensure the trigger function has SECURITY DEFINER to bypass RLS
- Recreate the trigger to ensure it's active

## Step 2: Verify the Setup

After running the SQL, verify the policies exist:

```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Check trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

You should see:
- "Users can insert their own profile" (INSERT policy)
- "Public profiles are viewable by everyone" (SELECT policy)
- "Users can view their own profile" (SELECT policy)
- "Users can update their own profile" (UPDATE policy)

## How It Works

1. **Trigger Function**: Uses `SECURITY DEFINER` to bypass RLS and create profiles automatically
2. **INSERT Policy**: Allows users to insert their own profile (backup if trigger fails)
3. **SELECT Policy**: Allows profiles to be viewable for admin dashboard
4. **Signup Flow**: Waits for trigger to create profile, with retries and fallback handling

## Testing

After running the SQL fix:
1. Try signing up with a new email
2. The profile should be created automatically by the trigger
3. You should be logged in and redirected to dashboard
4. No RLS errors should appear in the console

If you still see errors, check:
- The trigger function exists and has SECURITY DEFINER
- The INSERT policy is active
- The user is properly authenticated when the trigger runs

