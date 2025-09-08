# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization and enter project details:
   - Name: (choose a name)
   - Database Password: (choose a strong password)
   - Region: (choose closest to your location)
4. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - Project URL
   - Anon (public) key

## 3. Set Up Environment Variables

1. In `.env.local` file in the project root, add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the placeholder values with your actual Supabase credentials.

## 4. Run the Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Paste it into the SQL Editor and run it

**Note**: If you encounter errors about existing triggers or policies, the schema includes `DROP IF EXISTS` statements to handle this safely.

This will create:

- `users` table with authentication integration
- `books` table for library inventory
- `borrowed_books` table for tracking loans
- Proper indexes and constraints
- Row Level Security (RLS) policies (simplified for development)
- Automatic triggers for data consistency

## 5. Verify Setup

1. Start your Next.js development server: `npm run dev`
2. Visit the test page at `http://localhost:3000/test-supabase`
3. Check that the connection test shows "Connected to Supabase"
4. In Supabase dashboard, verify the tables were created correctly

## 6. Troubleshooting

### Connection Issues

If you see "Missing Supabase environment variables":

- Ensure your `.env.local` file exists in the project root
- Verify the environment variable names are exactly as shown above
- Restart your development server after adding environment variables

### Database Errors

If you encounter "infinite recursion detected in policy" errors:

- The schema has been updated to use simplified policies
- Re-run the `supabase/schema.sql` file in your Supabase SQL Editor
- The updated schema includes `DROP IF EXISTS` statements to handle existing objects

### Test Page

The test page at `/test-supabase` will:

- Automatically test your Supabase connection
- Show which tables are accessible
- Allow you to test database write operations
- Provide specific error messages if something is wrong

## Database Schema Overview

### Users Table

- `id`: UUID (references auth.users)
- `email`: User's email address
- `role`: 'USER' or 'ADMIN'
- `approval_status`: 'PENDING', 'APPROVED', or 'REJECTED'

### Books Table

- `id`: UUID primary key
- `title`: Book title
- `author`: Book author
- `isbn`: Unique ISBN
- `category`: Book category
- `total_copies`: Total number of copies
- `available_copies`: Currently available copies
- `is_active`: Whether the book is active

### Borrowed Books Table

- `id`: UUID primary key
- `book_id`: References books table
- `user_id`: References users table
- `borrowed_at`: When the book was borrowed
- `returned_at`: When the book was returned (null if still borrowed)
- `due_date`: When the book should be returned
