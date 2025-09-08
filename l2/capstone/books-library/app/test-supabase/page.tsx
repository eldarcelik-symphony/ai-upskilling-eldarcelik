'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface ConnectionStatus {
  connected: boolean;
  error?: string;
  tables?: string[];
}

export default function TestSupabasePage() {
  const [status, setStatus] = useState<ConnectionStatus>({ connected: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setLoading(true);

      // Test basic connection
      const { error } = await supabase
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

      setStatus({
        connected: true,
        tables: availableTables,
      });
    } catch (error) {
      console.error('Supabase connection error:', error);
      setStatus({
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  const testInsert = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert({
          title: 'Test Book',
          author: 'Test Author',
          isbn: `test-${Date.now()}`,
          category: 'Test',
          total_copies: 1,
          available_copies: 1,
        })
        .select();

      if (error) throw error;

      alert('Test book inserted successfully!');
      console.log('Inserted book:', data);
    } catch (error) {
      alert(
        `Insert failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
      console.error('Insert error:', error);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
          <p>Testing Supabase connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-4xl mx-auto px-4'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>
          Supabase Connection Test
        </h1>

        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Connection Status</h2>

          {status.connected ? (
            <div className='space-y-4'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                <span className='text-green-700 font-medium'>
                  Connected to Supabase
                </span>
              </div>

              {status.tables && status.tables.length > 0 && (
                <div>
                  <h3 className='font-medium mb-2'>Available Tables:</h3>
                  <ul className='list-disc list-inside space-y-1'>
                    {status.tables.map((table) => (
                      <li key={table} className='text-gray-600'>
                        {table}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                <span className='text-red-700 font-medium'>
                  Connection Failed
                </span>
              </div>

              {status.error && (
                <div className='bg-red-50 border border-red-200 rounded-md p-4'>
                  <h3 className='font-medium text-red-800 mb-2'>
                    Error Details:
                  </h3>
                  <p className='text-red-700 text-sm'>{status.error}</p>
                </div>
              )}

              <div className='bg-yellow-50 border border-yellow-200 rounded-md p-4'>
                <h3 className='font-medium text-yellow-800 mb-2'>
                  Setup Required:
                </h3>
                <ol className='list-decimal list-inside text-yellow-700 text-sm space-y-1'>
                  <li>
                    Create a Supabase project at{' '}
                    <a
                      href='https://supabase.com'
                      className='underline'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      supabase.com
                    </a>
                  </li>
                  <li>Get your Project URL and Anon Key from Settings → API</li>
                  <li>
                    Create a{' '}
                    <code className='bg-yellow-100 px-1 rounded'>
                      .env.local
                    </code>{' '}
                    file in the project root
                  </li>
                  <li>Add the following variables:</li>
                </ol>
                <pre className='mt-2 bg-yellow-100 p-2 rounded text-xs overflow-x-auto'>
                  {`NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here`}
                </pre>
                <p className='text-yellow-700 text-sm mt-2'>
                  Then run the SQL schema from{' '}
                  <code className='bg-yellow-100 px-1 rounded'>
                    supabase/schema.sql
                  </code>{' '}
                  in your Supabase SQL Editor.
                </p>
              </div>
            </div>
          )}
        </div>

        {status.connected && (
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-xl font-semibold mb-4'>
              Test Database Operations
            </h2>
            <div className='space-y-4'>
              <button
                onClick={testInsert}
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors'
              >
                Test Insert Book
              </button>
              <p className='text-sm text-gray-600'>
                This will insert a test book to verify write permissions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
