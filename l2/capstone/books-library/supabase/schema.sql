-- Books Library Database Schema
-- This schema creates all necessary tables, functions, triggers, and RLS policies
-- for a complete books library management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (main user table in public schema)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    approval_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create books table
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    total_copies INTEGER NOT NULL DEFAULT 1 CHECK (total_copies > 0),
    available_copies INTEGER NOT NULL DEFAULT 1 CHECK (available_copies >= 0 AND available_copies <= total_copies),
    is_active BOOLEAN NOT NULL DEFAULT true,
    cover_image_url TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment to document the cover_image_url column
COMMENT ON COLUMN books.cover_image_url IS 'URL to the book cover image stored in Supabase Storage';

-- Create borrowed_books table
CREATE TABLE borrowed_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    borrowed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    returned_at TIMESTAMP WITH TIME ZONE NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure a user can't borrow the same book multiple times without returning it
    UNIQUE(book_id, user_id, returned_at)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_approval_status ON users(approval_status);
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_is_active ON books(is_active);
CREATE INDEX idx_borrowed_books_user_id ON borrowed_books(user_id);
CREATE INDEX idx_borrowed_books_book_id ON borrowed_books(book_id);
CREATE INDEX idx_borrowed_books_due_date ON borrowed_books(due_date);
CREATE INDEX idx_borrowed_books_returned_at ON borrowed_books(returned_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_borrowed_books_updated_at BEFORE UPDATE ON borrowed_books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically update available_copies when books are borrowed/returned
CREATE OR REPLACE FUNCTION update_available_copies()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Book is being borrowed
        UPDATE books 
        SET available_copies = available_copies - 1 
        WHERE id = NEW.book_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Book is being returned
        IF OLD.returned_at IS NULL AND NEW.returned_at IS NOT NULL THEN
            UPDATE books 
            SET available_copies = available_copies + 1 
            WHERE id = NEW.book_id;
        ELSIF OLD.returned_at IS NOT NULL AND NEW.returned_at IS NULL THEN
            UPDATE books 
            SET available_copies = available_copies - 1 
            WHERE id = NEW.book_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Borrowed book record is being deleted
        IF OLD.returned_at IS NULL THEN
            UPDATE books 
            SET available_copies = available_copies + 1 
            WHERE id = OLD.book_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update available_copies
CREATE TRIGGER update_available_copies_trigger
    AFTER INSERT OR UPDATE OR DELETE ON borrowed_books
    FOR EACH ROW EXECUTE FUNCTION update_available_copies();

-- Create function to automatically create user when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into users table with explicit permissions
    INSERT INTO public.users (id, email, role, approval_status)
    VALUES (
        NEW.id,
        NEW.email,
        'USER',
        'PENDING'
    )
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE WARNING 'Failed to create user: %', SQLERRM;
        RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger that fires when a new user is inserted into auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions to the function
GRANT USAGE ON SCHEMA public TO postgres;
GRANT INSERT ON public.users TO postgres;

-- Create RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrowed_books ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own data
CREATE POLICY "Users can manage own data" ON users
    FOR ALL USING (auth.uid() = id);

-- Allow the trigger function to insert new users
CREATE POLICY "Allow trigger to insert users" ON users
    FOR INSERT WITH CHECK (true);

-- Allow all users to view all users (for user directory functionality)
CREATE POLICY "Allow all users to view users" ON users
    FOR SELECT USING (true);

-- Anyone can view books (public catalog)
CREATE POLICY "Anyone can view books" ON books
    FOR SELECT USING (true);

-- Only authenticated users can manage books (for now - can be restricted to admins later)
CREATE POLICY "Authenticated users can manage books" ON books
    FOR ALL USING (auth.role() = 'authenticated');

-- Users can view their own borrowed books
CREATE POLICY "Users can view own borrowed books" ON borrowed_books
    FOR SELECT USING (auth.uid() = user_id);

-- Users can borrow books
CREATE POLICY "Users can borrow books" ON borrowed_books
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can return their own books
CREATE POLICY "Users can return their own books" ON borrowed_books
    FOR UPDATE USING (auth.uid() = user_id);

-- Create storage bucket for book covers
INSERT INTO storage.buckets (id, name, public) 
VALUES ('book-covers', 'book-covers', true);

-- RLS policies for book-covers storage bucket

-- Allow anyone to view book cover images
CREATE POLICY "Anyone can view book covers" ON storage.objects
FOR SELECT USING (bucket_id = 'book-covers');

-- Allow only admins to upload book covers
CREATE POLICY "Only admins can upload book covers" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'book-covers' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'ADMIN'
  )
);

-- Allow only admins to update book covers
CREATE POLICY "Only admins can update book covers" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'book-covers' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'ADMIN'
  )
);

-- Allow only admins to delete book covers
CREATE POLICY "Only admins can delete book covers" ON storage.objects
FOR DELETE USING (
  bucket_id = 'book-covers' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'ADMIN'
  )
);