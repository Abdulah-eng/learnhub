# Transactions Database Setup

This guide will help you set up the transactions and user purchased courses tables in Supabase.

## Steps

1. **Run the Transactions Schema**
   - Go to your Supabase Dashboard
   - Navigate to SQL Editor
   - Run the `supabase/transactions_schema.sql` file
   - This will create:
     - `transactions` table - stores all course purchase transactions
     - `user_purchased_courses` table - tracks which courses each user has purchased
     - Row Level Security (RLS) policies for data access control
     - Indexes for better query performance

2. **Verify the Setup**
   - Check that both tables were created successfully
   - Verify RLS is enabled on both tables
   - Test that users can only see their own transactions (non-admin users)

## Database Schema

### Transactions Table
- `id` - UUID primary key
- `user_id` - References auth.users
- `course_id` - References courses table
- `course_title` - Course title at time of purchase
- `course_price` - Course price at time of purchase
- `service_tax` - 18% service tax
- `total_amount` - Total amount paid
- `status` - 'completed' or 'disputed'
- `dispute_reason` - Optional reason for dispute
- `created_at` - Timestamp
- `updated_at` - Timestamp

### User Purchased Courses Table
- `id` - UUID primary key
- `user_id` - References auth.users
- `course_id` - References courses table
- `transaction_id` - References transactions table
- `purchased_at` - Timestamp

## RLS Policies

- **Users** can view, insert, and update their own transactions
- **Admins** can view all transactions
- **Users** can view and insert their own purchased courses
- **Admins** can view all purchased courses

## Notes

- Transactions are automatically created when a user purchases a course
- Purchased courses are automatically added when a transaction is created
- The system tracks course purchases and allows users to dispute transactions

