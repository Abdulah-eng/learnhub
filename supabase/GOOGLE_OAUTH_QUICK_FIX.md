# Quick Fix: Google OAuth redirect_uri_mismatch Error

## The Problem
You're seeing: **Error 400: redirect_uri_mismatch**

This happens because Google doesn't recognize the redirect URI that Supabase is trying to use.

## The Solution (5 minutes)

### Step 1: Find Your Supabase Project Reference

1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **API**
3. Look at your **Project URL** - it will look like:
   ```
   https://yzoodqerqrzfstiejaov.supabase.co
   ```
4. Copy the part before `.supabase.co`: `yzoodqerqrzfstiejaov`

### Step 2: Add Redirect URI to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your **OAuth 2.0 Client ID** (the one you're using for Supabase)
5. Under **Authorized redirect URIs**, click **+ ADD URI**
6. Add this EXACT URL (replace `yzoodqerqrzfstiejaov` with YOUR project reference):
   ```
   https://yzoodqerqrzfstiejaov.supabase.co/auth/v1/callback
   ```
7. Click **SAVE**

### Step 3: Wait and Test

1. Wait 2-5 minutes for Google to update
2. Try signing in with Google again

## Important Notes

- ✅ The URL must be EXACTLY: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
- ✅ No trailing slashes
- ✅ Use `https://` not `http://`
- ✅ The path is `/auth/v1/callback` (not `/auth/callback`)

## Example

If your Supabase URL is: `https://yzoodqerqrzfstiejaov.supabase.co`

Then add to Google Cloud Console:
```
https://yzoodqerqrzfstiejaov.supabase.co/auth/v1/callback
```

## Still Not Working?

1. Double-check you're using the correct OAuth Client ID in Supabase
2. Make sure the redirect URI matches EXACTLY (copy-paste it)
3. Wait 10 minutes and try again (Google can take time to update)
4. Try removing the redirect URI and adding it again

