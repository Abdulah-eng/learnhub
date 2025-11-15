# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication in Supabase.

## Step 1: Configure Google OAuth in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list and click on it
4. Toggle **Enable Google provider** to ON
5. You'll need to provide:
   - **Client ID (for OAuth)**: Get this from Google Cloud Console
   - **Client Secret (for OAuth)**: Get this from Google Cloud Console

## Step 2: Set Up Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure the OAuth consent screen if prompted:
   - Choose **External** user type
   - Fill in the required information (App name, User support email, Developer contact)
   - Add scopes: `email`, `profile`
   - Add test users if needed
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: **LearnHub** (or your app name)
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for local development)
     - `https://your-domain.com` (for production)
   - **Authorized redirect URIs** (IMPORTANT - Add these EXACT URLs):
     - **`https://your-project-ref.supabase.co/auth/v1/callback`** (REQUIRED - Replace `your-project-ref` with your actual Supabase project reference)
     - `http://localhost:3000/auth/callback` (optional - for direct app callback)
     - `https://your-domain.com/auth/callback` (optional - for production direct callback)
   
   **⚠️ CRITICAL**: The Supabase callback URL (`https://your-project-ref.supabase.co/auth/v1/callback`) is the MOST IMPORTANT one. This is what Google will redirect to, and Supabase will then redirect to your app.
   
   To find your Supabase project reference:
   - Go to Supabase Dashboard → Settings → API
   - Your project URL will be like: `https://abcdefghijklmnop.supabase.co`
   - Use `abcdefghijklmnop` as your project reference
   
7. Copy the **Client ID** and **Client Secret**

## Step 3: Add Credentials to Supabase

1. In Supabase Dashboard → Authentication → Providers → Google
2. Paste your **Client ID** and **Client Secret**
3. Click **Save**

## Step 4: Update Redirect URLs in Supabase

Make sure your Supabase project has the correct redirect URLs:
1. Go to **Authentication** → **URL Configuration**
2. Set the following:
   - **Site URL**: `http://localhost:3000` (for development) or your production URL
   - **Redirect URLs** (add these):
     - `http://localhost:3000/auth/callback` (for local development)
     - `https://your-domain.com/auth/callback` (for production)
   
   These are the URLs Supabase will redirect to AFTER processing the OAuth callback from Google.

## Step 5: Test Google OAuth

1. Start your development server: `npm run dev`
2. Click "Login" in your app
3. Click "Continue with Google"
4. You should be redirected to Google's sign-in page
5. After signing in, you'll be redirected back to your dashboard

## Important Notes

- **Profile Creation**: The trigger function will automatically create a profile for Google OAuth users with role 'user'
- **Name Extraction**: The user's name will be extracted from Google's user data
- **Email**: The email from Google account will be used
- **Role**: All Google OAuth users will have the 'user' role (not admin)

## Troubleshooting

If you encounter issues:

1. **"redirect_uri_mismatch" (Error 400)**:
   - **This is the most common error!**
   - The redirect URI in Google Cloud Console MUST match: `https://your-project-ref.supabase.co/auth/v1/callback`
   - To find your project reference: Go to Supabase Dashboard → Settings → API → Your Project URL
   - Example: If your Supabase URL is `https://yzoodqerqrzfstiejaov.supabase.co`, then add:
     - `https://yzoodqerqrzfstiejaov.supabase.co/auth/v1/callback`
   - Make sure there are NO trailing slashes
   - The URL must match EXACTLY (case-sensitive)
   - After adding, wait a few minutes for Google to update

2. **"Invalid client"**: 
   - Verify your Client ID and Secret are correct in Supabase
   - Make sure you copied them from the correct OAuth client in Google Cloud Console

3. **Profile not created**: 
   - Check that the trigger function `handle_new_user()` is active and has SECURITY DEFINER
   - Run the `supabase/fix_profiles_rls.sql` file if you haven't already

4. **Still getting redirect_uri_mismatch after adding the URL**:
   - Double-check the URL is exactly: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   - Make sure you're using the correct project reference from your Supabase URL
   - Try removing and re-adding the redirect URI in Google Cloud Console
   - Wait 5-10 minutes after adding the URI before testing again

## Production Deployment

When deploying to production:
1. Update Google Cloud Console with production URLs
2. Update Supabase redirect URLs with production domain
3. Make sure environment variables are set correctly in your hosting platform

