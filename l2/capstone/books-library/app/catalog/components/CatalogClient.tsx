'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import Link from 'next/link';
import { Book } from '@/lib/actions/book.actions';

interface CatalogClientProps {
  initialBooks: Book[];
  initialHasMore: boolean;
  initialTotalCount: number;
  categories: readonly string[];
}

export default function CatalogClient({
  initialBooks,
  initialHasMore,
  initialTotalCount,
  categories,
}: CatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('query') || ''
  );
  const [category, setCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [availability, setAvailability] = useState<
    'all' | 'available' | 'unavailable'
  >(
    (searchParams.get('availability') as 'all' | 'available' | 'unavailable') ||
      'all'
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSearchRef = useRef<string>('');

  // Function to update URL with current filters
  const updateURL = useCallback(
    (newQuery: string, newCategory: string, newAvailability: string) => {
      const params = new URLSearchParams();

      if (newQuery.trim()) params.set('query', newQuery.trim());
      if (newCategory && newCategory !== 'all')
        params.set('category', newCategory);
      if (newAvailability && newAvailability !== 'all')
        params.set('availability', newAvailability);

      const newURL = params.toString() ? `?${params.toString()}` : '';
      router.replace(`/catalog${newURL}`, { scroll: false });
    },
    [router]
  );

  const loadBooks = useCallback(
    async (pageNum: number, reset = false) => {
      if (loading) return;

      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: '12',
          ...(query && { query }),
          ...(category && category !== 'all' && { category }),
          ...(availability !== 'all' && { availability }),
        });

        const response = await fetch(`/api/catalog?${params}`);
        const data = await response.json();

        if (reset) {
          setBooks(data.books);
        } else {
          setBooks((prev) => [...prev, ...data.books]);
        }
        setHasMore(data.hasMore);
        setPage(pageNum);
      } catch (error) {
        console.error('Error loading books:', error);
      } finally {
        setLoading(false);
      }
    },
    [query, category, availability, loading]
  );

  // Reset books when filters change
  useEffect(() => {
    const loadBooksForFilters = async () => {
      setBooks([]);
      setPage(1);
      setHasMore(true);
      setLoading(true);

      try {
        const params = new URLSearchParams({
          page: '1',
          limit: '12',
          ...(query && { query }),
          ...(category && category !== 'all' && { category }),
          ...(availability !== 'all' && { availability }),
        });

        const response = await fetch(`/api/catalog?${params}`);
        const data = await response.json();

        setBooks(data.books);
        setHasMore(data.hasMore);
        setPage(1);
      } catch (error) {
        console.error('Error loading books:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBooksForFilters();
  }, [query, category, availability]);

  // Update URL when category or availability changes
  useEffect(() => {
    updateURL(query, category, availability);
  }, [category, availability, query, updateURL]);

  // Debounced search effect
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
      setQuery(searchQuery);
      // Update URL with new search query
      updateURL(searchQuery, category, availability);
    }, 1000);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery, category, availability, updateURL]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadBooks(page + 1);
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, loading, page, loadBooks]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Book Catalog</h1>
        <p className='text-gray-600 mb-6'>
          Discover our collection of {initialTotalCount} books
        </p>

        {/* Search and Filters */}
        <div className='flex flex-col sm:flex-row gap-4 mb-6'>
          <div className='flex-1 relative'>
            <Input
              placeholder='Search by title or author...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pr-10'
            />
            {searchQuery && (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => setSearchQuery('')}
                className='absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100'
              >
                ×
              </Button>
            )}
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className='w-full sm:w-48'>
              <SelectValue placeholder='All Categories' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={availability}
            onValueChange={(value: 'all' | 'available' | 'unavailable') =>
              setAvailability(value)
            }
          >
            <SelectTrigger className='w-full sm:w-48'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Books</SelectItem>
              <SelectItem value='available'>Available Only</SelectItem>
              <SelectItem value='unavailable'>Unavailable Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {books.length === 0 && !loading ? (
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg'>
            No books found matching your criteria.
          </p>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/catalog/${book.id}`}
                className='group transition-transform hover:scale-105'
              >
                <Card className='h-full overflow-hidden shadow-md hover:shadow-lg transition-shadow'>
                  <CardHeader className='p-0'>
                    <div className='aspect-[3/4] relative overflow-hidden'>
                      {book.cover_image_url ? (
                        <Image
                          src={book.cover_image_url}
                          alt={`${book.title} cover`}
                          fill
                          className='object-cover group-hover:scale-110 transition-transform duration-300'
                          sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw'
                        />
                      ) : (
                        <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                          <div className='text-center text-gray-500'>
                            <div className='text-4xl mb-2'>📚</div>
                            <p className='text-sm'>No Cover</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className='p-4'>
                    <CardTitle className='text-lg font-semibold line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors'>
                      {book.title}
                    </CardTitle>
                    <p className='text-sm text-gray-600 mb-2 line-clamp-1'>
                      by {book.author}
                    </p>
                    <div className='flex items-center justify-between text-xs text-gray-500'>
                      <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
                        {book.category}
                      </span>
                      <span
                        className={
                          book.available_copies > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        {book.available_copies > 0
                          ? `${book.available_copies} available`
                          : 'Unavailable'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Loading indicator and infinite scroll trigger */}
          {loading && (
            <div className='text-center py-8'>
              <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
              <p className='mt-2 text-gray-600'>Loading more books...</p>
            </div>
          )}

          {!hasMore &&
            books.length > 0 &&
            !query &&
            category === 'all' &&
            availability === 'all' && (
              <div className='text-center py-8'>
                <p className='text-gray-500'>
                  You&apos;ve reached the end of the catalog!
                </p>
              </div>
            )}

          {/* Scroll sentinel for infinite scroll */}
          <div id='scroll-sentinel' className='h-10' />
        </>
      )}
    </div>
  );
}
