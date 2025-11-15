# Supabase Setup Guide

This guide will help you connect your Next.js application to Supabase and set up the database.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in your project details:
   - Name: `course-listing-website` (or any name you prefer)
   - Database Password: Create a strong password (save it securely)
   - Region: Choose the closest region to your users
5. Click "Create new project" and wait for it to be set up (takes 1-2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL**: Copy this value
   - **anon/public key**: Copy this value (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. Copy the `env.example` file to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Open `.env.local` and fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Replace the placeholder values with your actual Supabase credentials from Step 2.

## Step 4: Run the Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New query"
3. Open the `supabase/schema.sql` file from this project
4. Copy the entire contents of `schema.sql`
5. Paste it into the SQL Editor in Supabase
6. Click "Run" (or press Ctrl+Enter)
7. You should see "Success. No rows returned" - this means the tables were created successfully

## Step 5: Verify the Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see two tables:
   - `categories` (with 4 categories)
   - `courses` (with 6 sample courses)

3. Check that the data was inserted correctly by viewing the tables

## Step 6: Install Dependencies and Run

1. Install the Supabase client library:
   ```bash
   npm install
   ```

2. Start your development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) and verify that courses are loading from the database

## Troubleshooting

### Courses not loading?

1. **Check environment variables**: Make sure `.env.local` has the correct values
2. **Check Supabase connection**: Verify your Project URL and anon key are correct
3. **Check browser console**: Look for any error messages
4. **Verify RLS policies**: Make sure Row Level Security policies allow public read access (they should be set up in the schema)

### Database connection errors?

1. Make sure your Supabase project is active (not paused)
2. Check that you're using the correct Project URL (not the project reference)
3. Verify the anon key is correct (it should start with `eyJ`)

### Schema errors?

1. Make sure you ran the entire `schema.sql` file
2. Check the SQL Editor for any error messages
3. If tables already exist, you may need to drop them first (be careful!)

## Next Steps

- Add more courses through the Supabase Table Editor
- Create an admin interface to manage courses
- Set up authentication for users
- Add more features as needed

## Database Schema Overview

### Tables

1. **categories**
   - `id` (UUID, Primary Key)
   - `name` (VARCHAR, Unique)
   - `slug` (VARCHAR, Unique)
   - `created_at`, `updated_at` (Timestamps)

2. **courses**
   - `id` (UUID, Primary Key)
   - `title` (VARCHAR)
   - `description` (TEXT)
   - `instructor` (VARCHAR)
   - `price` (DECIMAL)
   - `image_url` (TEXT)
   - `duration` (VARCHAR)
   - `level` (VARCHAR: Beginner, Intermediate, Advanced)
   - `students` (INTEGER)
   - `rating` (DECIMAL: 0-5)
   - `category_id` (UUID, Foreign Key to categories)
   - `created_at`, `updated_at` (Timestamps)

### Security

- Row Level Security (RLS) is enabled
- Public read access is allowed for both tables
- Write operations require authentication (can be configured later)

