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

export interface GetBooksParams {
  page?: number;
  limit?: number;
  query?: string;
}

export interface GetBooksResult {
  books: Book[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getBooks({
  page = 1,
  limit = 10,
  query = '',
}: GetBooksParams = {}): Promise<GetBooksResult> {
  try {
    const supabase = await createClient();

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build the base query
    let supabaseQuery = supabase
      .from('books')
      .select('*', { count: 'exact' })
      .eq('is_active', true); // Only show active books by default

    // Add search filter if query is provided
    if (query.trim()) {
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${query}%,author.ilike.%${query}%,category.ilike.%${query}%`
      );
    }

    // Add pagination and ordering
    supabaseQuery = supabaseQuery
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    const { data: books, error, count } = await supabaseQuery;

    if (error) {
      console.error('Error fetching books:', error);
      throw new Error('Failed to fetch books');
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
    console.error('Error in getBooks action:', error);
    throw new Error('Failed to fetch books');
  }
}

export async function getAllBooks(): Promise<Book[]> {
  try {
    const supabase = await createClient();

    const { data: books, error } = await supabase
      .from('books')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all books:', error);
      throw new Error('Failed to fetch books');
    }

    return books || [];
  } catch (error) {
    console.error('Error in getAllBooks action:', error);
    throw new Error('Failed to fetch books');
  }
}
