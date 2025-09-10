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

This will create:

- `users` table with authentication integration
- `books` table for library inventory with cover image support
- `borrowed_books` table for tracking loans
- `book-covers` storage bucket for cover image management
- Performance indexes for optimal query speed
- Row Level Security (RLS) policies for data protection
- Automatic triggers for data consistency and business logic
- Functions for automatic user creation and book availability tracking
- Storage policies for secure image upload and management

## 5. Verify Setup

1. Start your Next.js development server: `npm run dev`
2. Visit the test page at `http://localhost:3000/test-supabase`
3. Check that the connection test shows "Connected to Supabase"
4. In Supabase dashboard, verify the tables were created correctly

## Database Schema Overview

### Users Table

- `id`: UUID (references auth.users)
- `email`: User's email address
- `role`: 'USER' or 'ADMIN'
- `approval_status`: 'PENDING', 'APPROVED', or 'REJECTED'
- `created_at`: Timestamp when user was created
- `updated_at`: Timestamp when user was last updated

### Books Table

- `id`: UUID primary key
- `title`: Book title
- `author`: Book author
- `isbn`: Unique ISBN
- `category`: Book category
- `total_copies`: Total number of copies
- `available_copies`: Currently available copies (automatically managed)
- `is_active`: Whether the book is active
- `cover_image_url`: URL to the book cover image stored in Supabase Storage
- `created_at`: Timestamp when book was added
- `updated_at`: Timestamp when book was last updated

### Borrowed Books Table

- `id`: UUID primary key
- `book_id`: References books table
- `user_id`: References users table
- `borrowed_at`: When the book was borrowed
- `returned_at`: When the book was returned (null if still borrowed)
- `due_date`: When the book should be returned
- `created_at`: Timestamp when record was created
- `updated_at`: Timestamp when record was last updated

## Database Features

### Automatic Functions & Triggers

1. **User Auto-Creation**: When a new user signs up via Supabase Auth, they are automatically added to the `users` table with 'PENDING' approval status.

2. **Book Availability Tracking**: The `available_copies` field is automatically updated when books are borrowed or returned through triggers.

3. **Timestamp Management**: All tables have `created_at` and `updated_at` fields that are automatically maintained.

4. **Cover Image Management**: Storage bucket and policies are created for secure book cover image upload and management.

### Performance Optimizations

- **Indexes** on frequently queried fields:
  - User email, role, and approval status
  - Book ISBN, category, and active status
  - Borrowed books by user, book, due date, and return status

### Security (Row Level Security)

- **Users**: Can view and update their own data, plus view all users
- **Books**: Public read access, authenticated users can manage books
- **Borrowed Books**: Users can only view and manage their own borrowed books
- **Storage (Book Covers)**: Public read access, only admins can upload/update/delete cover images

### Data Integrity

- **Constraints**: Proper foreign key relationships and check constraints
- **Unique Constraints**: Prevents duplicate book borrowings and ensures data consistency
- **Cascade Deletes**: Proper cleanup when users or books are removed
