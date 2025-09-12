import { getCatalogBooks } from '@/lib/actions/book.actions';
import { CATEGORIES } from '@/lib/constants';
import CatalogClient from './components/CatalogClient';

// Force dynamic rendering since we're using Supabase client with cookies
export const dynamic = 'force-dynamic';

interface CatalogPageProps {
  searchParams: Promise<{
    query?: string;
    category?: string;
    availability?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  // Await the searchParams Promise
  const params = await searchParams;

  // Get initial data with URL parameters
  const initialResult = await getCatalogBooks({
    limit: 12,
    query: params.query || '',
    category: params.category || '',
    availability:
      (params.availability as 'all' | 'available' | 'unavailable') || 'all',
  });

  return (
    <CatalogClient
      initialBooks={initialResult.books}
      initialHasMore={initialResult.hasMore}
      initialTotalCount={initialResult.totalCount}
      categories={CATEGORIES}
    />
  );
}
