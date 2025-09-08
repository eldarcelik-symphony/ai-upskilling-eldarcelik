import { supabase } from './client';

export interface ConnectionTestResult {
  connected: boolean;
  error?: string;
  tables?: string[];
  timestamp: string;
}

/**
 * Test the Supabase connection and verify database access
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const timestamp = new Date().toISOString();

  try {
    // Test basic connection by trying to query the books table
    const { data, error } = await supabase
      .from('books')
      .select('count')
      .limit(1);

    if (error) {
      throw error;
    }

    // Test access to all expected tables
    const tableTests = await Promise.allSettled([
      supabase.from('users').select('count').limit(1),
      supabase.from('books').select('count').limit(1),
      supabase.from('borrowed_books').select('count').limit(1),
    ]);

    const availableTables = tableTests
      .map((result, index) => {
        if (result.status === 'fulfilled' && !result.value.error) {
          return ['users', 'books', 'borrowed_books'][index];
        }
        return null;
      })
      .filter(Boolean) as string[];

    return {
      connected: true,
      tables: availableTables,
      timestamp,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp,
    };
  }
}

/**
 * Test inserting a sample book to verify write permissions
 */
export async function testBookInsert(): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> {
  try {
    const testBook = {
      title: 'Connection Test Book',
      author: 'Test Author',
      isbn: `test-${Date.now()}`,
      category: 'Test',
      total_copies: 1,
      available_copies: 1,
    };

    const { data, error } = await supabase
      .from('books')
      .insert(testBook)
      .select();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
