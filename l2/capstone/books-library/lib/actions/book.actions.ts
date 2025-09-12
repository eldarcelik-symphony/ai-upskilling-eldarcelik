'use server';

import { createClient } from '@/lib/supabase/server';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  total_copies: number;
  available_copies: number;
  is_active: boolean;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type SortField = 'title' | 'author' | 'isbn' | 'category' | 'total_copies' | 'available_copies' | 'is_active' | 'created_at';
export type SortDirection = 'asc' | 'desc';

export interface GetBooksParams {
  page?: number;
  limit?: number;
  query?: string;
  status?: 'all' | 'active' | 'inactive';
  sortField?: SortField;
  sortDirection?: SortDirection;
}

export interface GetBooksResult {
  books: Book[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getAllBooks({
  page = 1,
  limit = 10,
  query = '',
  status = 'all',
  sortField,
  sortDirection = 'asc',
}: GetBooksParams = {}): Promise<GetBooksResult> {
  try {
    const supabase = await createClient();

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build the base query
    let supabaseQuery = supabase
      .from('books')
      .select('*', { count: 'exact' });

    // Add status filter
    if (status === 'active') {
      supabaseQuery = supabaseQuery.eq('is_active', true);
    } else if (status === 'inactive') {
      supabaseQuery = supabaseQuery.eq('is_active', false);
    }
    // If status is 'all', don't add any filter

    // Add search filter if query is provided
    if (query.trim()) {
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${query}%,author.ilike.%${query}%,category.ilike.%${query}%`
      );
    }

    // Add sorting if specified
    if (sortField) {
      supabaseQuery = supabaseQuery.order(sortField, { ascending: sortDirection === 'asc' });
    } else {
      // Default ordering by created_at
      supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
    }

    // Add pagination
    supabaseQuery = supabaseQuery.range(offset, offset + limit - 1);

    const { data: books, error, count } = await supabaseQuery;

    if (error) {
      console.error('Error fetching books:', error);
      throw new Error('Failed to fetch all books');
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      books: books || [],
      totalCount,
      page,
      limit,
      totalPages,
    };
  } catch (error) {
    console.error('Error in getAllBooks action:', error);
    throw new Error('Failed to fetch all books');
  }
}

export interface GetCatalogBooksParams {
  page?: number;
  limit?: number;
  query?: string;
  category?: string;
  availability?: 'all' | 'available' | 'unavailable';
}

export interface GetCatalogBooksResult {
  books: Book[];
  hasMore: boolean;
  totalCount: number;
}

export async function getCatalogBooks({
  page = 1,
  limit = 12,
  query = '',
  category = '',
  availability = 'all'
}: GetCatalogBooksParams = {}): Promise<GetCatalogBooksResult> {
  try {
    const supabase = await createClient();

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build the base query
    let supabaseQuery = supabase
      .from('books')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    // Add search filter if query is provided
    if (query.trim()) {
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${query}%,author.ilike.%${query}%`
      );
    }

    // Add category filter if provided
    if (category.trim()) {
      supabaseQuery = supabaseQuery.eq('category', category);
    }

    // Add availability filter
    if (availability === 'available') {
      supabaseQuery = supabaseQuery.gt('available_copies', 0);
    } else if (availability === 'unavailable') {
      supabaseQuery = supabaseQuery.eq('available_copies', 0);
    }

    // Add ordering and pagination
    supabaseQuery = supabaseQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: books, error, count } = await supabaseQuery;

    if (error) {
      console.error('Error fetching active books:', error);
      throw new Error('Failed to fetch active books');
    }

    const totalCount = count || 0;
    const hasMore = offset + limit < totalCount;

    return {
      books: books || [],
      hasMore,
      totalCount
    };
  } catch (error) {
    console.error('Error in getActiveBooks action:', error);
    throw new Error('Failed to fetch active books');
  }
}

export async function createBook(formData: FormData) {
  try {
    const supabase = await createClient();

    // Extract form data
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const isbn = formData.get('isbn') as string;
    const category = formData.get('category') as string;
    const total_copies = parseInt(formData.get('total_copies') as string);
    const coverImage = formData.get('coverImage') as File | null;

    // Validate required fields
    if (!title || !author || !isbn || !category || !total_copies) {
      throw new Error('Missing required fields');
    }

    // Check if book with same ISBN already exists
    const { data: existingBook, error: checkError } = await supabase
      .from('books')
      .select('id')
      .eq('isbn', isbn)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing book:', checkError);
      throw new Error('Failed to check for existing book');
    }

    if (existingBook) {
      throw new Error('A book with this ISBN already exists');
    }

    let cover_image_url: string | null = null;

    // Handle cover image upload if provided
    if (coverImage && coverImage.size > 0) {
      try {
        // Create a unique filename
        const fileExt = coverImage.name.split('.').pop();
        const fileName = `${isbn}-${Date.now()}.${fileExt}`;
        const filePath = `book-covers/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('book-covers')
          .upload(filePath, coverImage, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Error uploading cover image:', uploadError);
          throw new Error('Failed to upload cover image');
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('book-covers')
          .getPublicUrl(filePath);

        cover_image_url = urlData.publicUrl;
      } catch (error) {
        console.error('Error handling cover image:', error);
        throw new Error('Failed to process cover image');
      }
    }

    // Insert book into database
    const { data: newBook, error: insertError } = await supabase
      .from('books')
      .insert({
        title,
        author,
        isbn,
        category,
        total_copies,
        available_copies: total_copies, // Initially all copies are available
        cover_image_url,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating book:', insertError);
      throw new Error('Failed to create book');
    }

    return { success: true, book: newBook };
  } catch (error) {
    console.error('Error in createBook action:', error);
    throw error;
  }
}

export async function updateBook(bookId: string, formData: FormData) {
  try {
    const supabase = await createClient();

    // Extract form data
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const isbn = formData.get('isbn') as string;
    const category = formData.get('category') as string;
    const total_copies = parseInt(formData.get('total_copies') as string);
    const coverImage = formData.get('coverImage') as File | null;

    // Validate required fields
    if (!title || !author || !isbn || !category || !total_copies) {
      throw new Error('Missing required fields');
    }

    // Get the current book to check for ISBN conflicts and get current cover
    const { data: currentBook, error: fetchError } = await supabase
      .from('books')
      .select('isbn, cover_image_url')
      .eq('id', bookId)
      .single();

    if (fetchError) {
      console.error('Error fetching current book:', fetchError);
      throw new Error('Book not found');
    }

    // Check if ISBN is being changed and if the new ISBN already exists
    if (currentBook.isbn !== isbn) {
      const { data: existingBook, error: checkError } = await supabase
        .from('books')
        .select('id')
        .eq('isbn', isbn)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing book:', checkError);
        throw new Error('Failed to check for existing book');
      }

      if (existingBook) {
        throw new Error('A book with this ISBN already exists');
      }
    }

    let cover_image_url = currentBook.cover_image_url;

    // Handle cover image upload if provided
    if (coverImage && coverImage.size > 0) {
      try {
        // Delete old cover image if it exists
        if (currentBook.cover_image_url) {
          const oldImagePath = currentBook.cover_image_url.split('/').pop();
          if (oldImagePath) {
            await supabase.storage
              .from('book-covers')
              .remove([`book-covers/${oldImagePath}`]);
          }
        }

        // Create a unique filename
        const fileExt = coverImage.name.split('.').pop();
        const fileName = `${isbn}-${Date.now()}.${fileExt}`;
        const filePath = `book-covers/${fileName}`;

        // Upload new cover image to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('book-covers')
          .upload(filePath, coverImage, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Error uploading cover image:', uploadError);
          throw new Error('Failed to upload cover image');
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('book-covers')
          .getPublicUrl(filePath);

        cover_image_url = urlData.publicUrl;
      } catch (error) {
        console.error('Error handling cover image:', error);
        throw new Error('Failed to process cover image');
      }
    }

    // Calculate new available_copies based on current borrowed books
    const { data: borrowedBooks, error: borrowedError } = await supabase
      .from('borrowed_books')
      .select('id')
      .eq('book_id', bookId)
      .is('returned_at', null);

    if (borrowedError) {
      console.error('Error fetching borrowed books:', borrowedError);
      throw new Error('Failed to calculate available copies');
    }

    const borrowedCount = borrowedBooks?.length || 0;
    const newAvailableCopies = Math.max(0, total_copies - borrowedCount);

    // Update book in database
    const { data: updatedBook, error: updateError } = await supabase
      .from('books')
      .update({
        title,
        author,
        isbn,
        category,
        total_copies,
        available_copies: newAvailableCopies,
        cover_image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating book:', updateError);
      throw new Error('Failed to update book');
    }

    return { success: true, book: updatedBook };
  } catch (error) {
    console.error('Error in updateBook action:', error);
    throw error;
  }
}

export async function disableBook(bookId: string) {
  try {
    const supabase = await createClient();

    // Update book to set is_active to false
    const { data: updatedBook, error: updateError } = await supabase
      .from('books')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookId)
      .select()
      .single();

    if (updateError) {
      console.error('Error disabling book:', updateError);
      throw new Error('Failed to disable book');
    }

    return { success: true, book: updatedBook };
  } catch (error) {
    console.error('Error in disableBook action:', error);
    throw error;
  }
}

export async function getBookById(bookId: string): Promise<Book | null> {
  try {
    const supabase = await createClient();

    const { data: book, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      
      // Handle invalid UUID or other database errors by returning null
      console.error('Error fetching book by ID:', error);
      return null;
    }

    return book;
  } catch (error) {
    console.error('Error in getBookById action:', error);
    return null;
  }
}

export async function deleteBook(bookId: string) {
  try {
    const supabase = await createClient();

    // First, get the book to check for borrowed copies and get cover image
    const { data: book, error: fetchError } = await supabase
      .from('books')
      .select('cover_image_url, available_copies, total_copies')
      .eq('id', bookId)
      .single();

    if (fetchError) {
      console.error('Error fetching book:', fetchError);
      throw new Error('Book not found');
    }

    // Check if there are any borrowed copies
    if (book.available_copies < book.total_copies) {
      throw new Error('Cannot delete book with borrowed copies. Please disable it instead.');
    }

    // Delete cover image from storage if it exists
    if (book.cover_image_url) {
      try {
        const imagePath = book.cover_image_url.split('/').pop();
        if (imagePath) {
          await supabase.storage
            .from('book-covers')
            .remove([`book-covers/${imagePath}`]);
        }
      } catch (error) {
        console.error('Error deleting cover image:', error);
        // Continue with book deletion even if image deletion fails
      }
    }

    // Delete the book record
    const { error: deleteError } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId);

    if (deleteError) {
      console.error('Error deleting book:', deleteError);
      throw new Error('Failed to delete book');
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteBook action:', error);
    throw error;
  }
}
