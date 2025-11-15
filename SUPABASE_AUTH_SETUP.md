# Supabase Authentication Setup Guide

This guide will help you set up real authentication using Supabase Auth instead of hardcoded credentials.

## Step 1: Run the Authentication Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click "New query"
4. Open the `supabase/auth_schema.sql` file
5. Copy the entire contents and paste into the SQL Editor
6. Click "Run" (or press Ctrl+Enter)
7. You should see "Success. No rows returned" - this means the profiles table was created

## Step 2: Create Users via Supabase Dashboard

You need to create 6 users (1 admin + 5 regular users) through the Supabase Dashboard:

### Option A: Using Supabase Dashboard (Recommended)

1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click **"Add User"** → **"Create new user"**
3. For each user, fill in:
   - **Email**: (see list below)
   - **Password**: (see list below)
   - **Auto Confirm User**: ✅ Check this box
   - **User Metadata**: Add JSON with name and role:
     ```json
     {
       "name": "Admin",
       "role": "admin"
     }
     ```
     or
     ```json
     {
       "name": "John Smith",
       "role": "user"
     }
     ```

### Users to Create:

**Admin:**
- Email: `admin@learnhub.com`
- Password: `admin123`
- Metadata: `{"name": "Admin", "role": "admin"}`

**Users:**
1. Email: `john@example.com`
   - Password: `user123`
   - Metadata: `{"name": "John Smith", "role": "user"}`

2. Email: `sarah@example.com`
   - Password: `user123`
   - Metadata: `{"name": "Sarah Williams", "role": "user"}`

3. Email: `michael@example.com`
   - Password: `user123`
   - Metadata: `{"name": "Michael Brown", "role": "user"}`

4. Email: `emily@example.com`
   - Password: `user123`
   - Metadata: `{"name": "Emily Davis", "role": "user"}`

5. Email: `david@example.com`
   - Password: `user123`
   - Metadata: `{"name": "David Wilson", "role": "user"}`

### Option B: Using Supabase Admin API (Alternative)

If you prefer to create users programmatically, you can use the Supabase Admin API. However, this requires the service role key and should be done server-side for security.

## Step 3: Verify Users Were Created

1. Go to **Authentication** → **Users** in Supabase dashboard
2. You should see all 6 users listed
3. Go to **Table Editor** → **profiles**
4. You should see 6 profiles with the correct roles:
   - 1 profile with `role = 'admin'`
   - 5 profiles with `role = 'user'`

## Step 4: Update Roles (If Needed)

If the roles weren't set correctly via metadata, run the `supabase/create_users.sql` file:

1. Go to **SQL Editor**
2. Open `supabase/create_users.sql`
3. Copy and paste the contents
4. Click "Run"

This will update the roles for all users.

## Step 5: Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. Click "Login" and try logging in with:
   - Admin: `admin@learnhub.com` / `admin123`
   - User: `john@example.com` / `user123`

## How It Works

1. **User Sign Up/Login**: Users authenticate through Supabase Auth
2. **Profile Creation**: When a user is created, a trigger automatically creates a profile in the `profiles` table
3. **Role Management**: The `profiles` table stores the user's role (admin or user)
4. **Session Management**: Supabase handles session management automatically
5. **Authentication State**: The app listens to auth state changes and updates the UI accordingly

## Security Features

- **Row Level Security (RLS)**: Enabled on profiles table
- **Users can only view/update their own profile**
- **Password hashing**: Handled automatically by Supabase
- **Session tokens**: Managed securely by Supabase
- **Email verification**: Can be enabled in Supabase settings

## Troubleshooting

### Users not appearing in profiles table?

- Check if the trigger was created: Go to **Database** → **Functions** and look for `handle_new_user`
- If the trigger doesn't exist, re-run `auth_schema.sql`
- For existing users, you may need to manually create profiles

### Can't log in?

1. Verify the user exists in **Authentication** → **Users**
2. Check that the email and password are correct
3. Make sure "Auto Confirm User" was checked when creating the user
4. Check browser console for error messages

### Role not set correctly?

- Run the `create_users.sql` file to update roles
- Or manually update in the Table Editor

## Next Steps

- Add email verification (optional)
- Add password reset functionality
- Add user registration page
- Store purchased courses in database
- Add user preferences and settings

