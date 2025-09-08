-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    approval_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    total_copies INTEGER NOT NULL DEFAULT 1 CHECK (total_copies > 0),
    available_copies INTEGER NOT NULL DEFAULT 1 CHECK (available_copies >= 0 AND available_copies <= total_copies),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create borrowed_books table
CREATE TABLE IF NOT EXISTS borrowed_books (
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
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_approval_status ON users(approval_status);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_is_active ON books(is_active);
CREATE INDEX IF NOT EXISTS idx_borrowed_books_user_id ON borrowed_books(user_id);
CREATE INDEX IF NOT EXISTS idx_borrowed_books_book_id ON borrowed_books(book_id);
CREATE INDEX IF NOT EXISTS idx_borrowed_books_due_date ON borrowed_books(due_date);
CREATE INDEX IF NOT EXISTS idx_borrowed_books_returned_at ON borrowed_books(returned_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist, then recreate them
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_books_updated_at ON books;
DROP TRIGGER IF EXISTS update_borrowed_books_updated_at ON borrowed_books;

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

-- Drop existing trigger if it exists, then recreate it
DROP TRIGGER IF EXISTS update_available_copies_trigger ON borrowed_books;

-- Create trigger to automatically update available_copies
CREATE TRIGGER update_available_copies_trigger
    AFTER INSERT OR UPDATE OR DELETE ON borrowed_books
    FOR EACH ROW EXECUTE FUNCTION update_available_copies();

-- Create RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrowed_books ENABLE ROW LEVEL SECURITY;

-- For now, let's use simpler policies to avoid recursion issues
-- Users can view and update their own data
CREATE POLICY "Users can manage own data" ON users
    FOR ALL USING (auth.uid() = id);

-- Anyone can view books (for now, we'll restrict this later)
CREATE POLICY "Anyone can view books" ON books
    FOR SELECT USING (true);

-- For development, allow all operations on books (we'll restrict later)
CREATE POLICY "Allow all book operations" ON books
    FOR ALL USING (true);

-- Users can view their own borrowed books
CREATE POLICY "Users can view own borrowed books" ON borrowed_books
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own borrowed books
CREATE POLICY "Users can borrow books" ON borrowed_books
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own borrowed books (for returning)
CREATE POLICY "Users can return their own books" ON borrowed_books
    FOR UPDATE USING (auth.uid() = user_id);

-- For development, allow all operations on borrowed_books (we'll restrict later)
CREATE POLICY "Allow all borrowed book operations" ON borrowed_books
    FOR ALL USING (true);
