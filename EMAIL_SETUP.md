# Email Setup Guide

This guide explains how to configure email functionality for the LearnHub application.

## Features

1. **Admin Notification on User Signup**: When a new user signs up, the admin receives an email notification to approve the user.
2. **Course Purchase Confirmation**: When a user purchases a course, they receive an email with a Zoom link to join their classes.
3. **User Management**: Admins can approve/disapprove and block/unblock users from the dashboard.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# SMTP Configuration (for sending emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Admin Email (where signup notifications are sent)
ADMIN_EMAIL=admin@learnhub.com

# Zoom Link (default zoom link for all courses)
# You can also configure per-course zoom links in the future
NEXT_PUBLIC_ZOOM_LINK=https://zoom.us/j/YOUR_ZOOM_MEETING_ID

# Supabase Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App URL (for email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Gmail Setup

If you're using Gmail, you'll need to:

1. Enable 2-Step Verification on your Google account
2. Generate an App Password:
   - Go to your Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `SMTP_PASSWORD`

## Other Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
```

## Database Setup

Run the following SQL in your Supabase SQL Editor to add the required fields:

```sql
-- See supabase/user_management_schema.sql
```

This will add:
- `is_approved` field (defaults to false for new signups)
- `is_blocked` field (defaults to false)
- Admin policies for viewing and updating all profiles

## Testing

1. **Test Admin Notification**:
   - Sign up a new user
   - Check the admin email inbox for the notification

2. **Test Course Purchase Email**:
   - Purchase a course as a user
   - Check the user's email for the confirmation with Zoom link

3. **Test User Management**:
   - Log in as admin
   - Go to Dashboard → Users Overview
   - Try approving/disapproving and blocking/unblocking users

## Troubleshooting

### Emails not sending
- Check that all SMTP environment variables are set correctly
- Verify your SMTP credentials
- Check server logs for error messages
- Ensure your email provider allows SMTP connections from your server

### Users can't log in after signup
- New users require admin approval by default
- Admin must approve the user in the dashboard
- Check that `is_approved` is set to `true` in the database

### Blocked users can still access
- Blocked users are automatically logged out on next page load
- The login check happens on every authentication attempt

