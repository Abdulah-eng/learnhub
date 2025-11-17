# Setup Checklist

Follow these steps to complete the setup of the new features:

## 1. Database Setup

- [ ] Open Supabase SQL Editor
- [ ] Run the SQL from `supabase/user_management_schema.sql`
- [ ] Verify that `is_approved` and `is_blocked` columns were added to `profiles` table
- [ ] Verify that existing users have `is_approved = true` and `is_blocked = false`

## 2. Environment Variables

Create or update `.env.local` with:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Admin Email
ADMIN_EMAIL=admin@learnhub.com

# Zoom Link (default for all courses)
NEXT_PUBLIC_ZOOM_LINK=https://zoom.us/j/YOUR_ZOOM_MEETING_ID

# Supabase (if not already set)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Gmail App Password (if using Gmail)

- [ ] Enable 2-Step Verification on Google Account
- [ ] Go to Google Account → Security → 2-Step Verification → App passwords
- [ ] Generate app password for "Mail"
- [ ] Use this password in `SMTP_PASSWORD`

## 4. Test Features

### Test Admin Notification on Signup
- [ ] Sign up a new user account
- [ ] Check admin email inbox for notification
- [ ] Verify email contains user details and dashboard link

### Test User Approval
- [ ] Log in as admin
- [ ] Go to Dashboard → Users Overview
- [ ] Find the new user (should show "Pending" badge)
- [ ] Click "Approve" button
- [ ] Verify user can now log in

### Test User Blocking
- [ ] As admin, find a user in Users Overview
- [ ] Click "Block" button
- [ ] Verify user card shows "Blocked" badge
- [ ] Try logging in as blocked user
- [ ] Verify login is rejected with error message
- [ ] Click "Unblock" button
- [ ] Verify user can log in again

### Test Course Purchase Email
- [ ] Log in as a regular user
- [ ] Purchase a course
- [ ] Check user's email inbox
- [ ] Verify email contains:
  - Course details
  - Transaction ID
  - Zoom link
- [ ] Click zoom link to verify it works

## 5. Verify Security

- [ ] Blocked users cannot log in
- [ ] Unapproved users cannot log in
- [ ] Admin can approve/block users
- [ ] Regular users cannot access admin functions

## Troubleshooting

### Emails not sending
- Check SMTP credentials in `.env.local`
- Verify SMTP_HOST and SMTP_PORT are correct
- Check server console for error messages
- Test SMTP connection separately

### Users can't log in after signup
- Check that admin has approved the user
- Verify `is_approved = true` in database
- Check browser console for error messages

### API routes returning errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check that database migration was run
- Verify admin is logged in when testing

### Zoom link not working
- Verify `NEXT_PUBLIC_ZOOM_LINK` is set correctly
- Test the zoom link directly in browser
- Consider implementing per-course zoom links

## Next Steps

Once everything is working:
1. Configure actual zoom meeting links (per course or global)
2. Customize email templates if needed
3. Set up production SMTP service (SendGrid, Mailgun, etc.)
4. Monitor email delivery rates
5. Consider adding email logs/audit trail

