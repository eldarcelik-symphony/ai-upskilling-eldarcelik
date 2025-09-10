'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface BookSearchAndPaginationProps {
  currentPage: number;
  totalPages: number;
  currentQuery: string;
  showSearchOnly?: boolean;
  showPaginationOnly?: boolean;
  booksCount?: number;
  totalCount?: number;
}

export function BookSearchAndPagination({
  currentPage,
  totalPages,
  currentQuery,
  showSearchOnly = false,
  showPaginationOnly = false,
  booksCount,
  totalCount,
}: BookSearchAndPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(currentQuery);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSearchRef = useRef<string>(currentQuery);

  // Update lastSearchRef when currentQuery changes (from external navigation)
  useEffect(() => {
    lastSearchRef.current = currentQuery;
    setSearchQuery(currentQuery);
  }, [currentQuery]);

  // Debounce effect
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only search if the query has actually changed and is different from what we last searched
    if (searchQuery === lastSearchRef.current) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      lastSearchRef.current = searchQuery;

      const performSearch = () => {
        const params = new URLSearchParams(searchParams);
        if (searchQuery.trim()) {
          params.set('query', searchQuery.trim());
        } else {
          params.delete('query');
        }
        params.set('page', '1'); // Reset to first page when searching
        router.push(`?${params.toString()}`);
      };

      startTransition(performSearch);
    }, 1000);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery, searchParams, router]);

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set('page', newPage.toString());
      router.push(`?${params.toString()}`);
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className='space-y-4'>
      {/* Search Form */}
      {!showPaginationOnly && (
        <div className='flex justify-end'>
          <div className='relative w-80'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
            <Input
              type='text'
              placeholder='Search books by title, author, or category'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 pr-10'
              disabled={isPending}
            />
            {searchQuery && (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={clearSearch}
                disabled={isPending}
                className='absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100'
              >
                ×
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {!showSearchOnly && totalPages > 1 && (
        <div className='flex items-center justify-between'>
          <div className='text-sm text-gray-600'>
            Page {currentPage} of {totalPages}
          </div>
          {booksCount !== undefined && totalCount !== undefined && (
            <div className='text-sm text-gray-600'>
              Showing {booksCount} of {totalCount} books
            </div>
          )}
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isPending}
            >
              <ChevronLeft className='h-4 w-4' />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className='flex items-center gap-1'>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isPending}
                    className='w-8 h-8 p-0'
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isPending}
            >
              Next
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
