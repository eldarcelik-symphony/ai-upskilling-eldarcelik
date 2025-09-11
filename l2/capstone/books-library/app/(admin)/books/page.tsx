import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTableWrapper } from './components/data-table-wrapper';
import { getBooks } from '@/lib/actions/book.actions';
import { BookSearchAndPagination } from '@/app/(admin)/books/components/book-search-pagination';
import { BookFormWrapper } from './components/book-form-wrapper';
interface AdminBooksPageProps {
  searchParams: Promise<{
    page?: string;
    query?: string;
    status?: string;
  }>;
}

export default async function AdminBooksPage({
  searchParams,
}: AdminBooksPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const query = params.query || '';
  const status = (params.status as 'all' | 'active' | 'inactive') || 'all';
  const limit = 10;

  let booksData;
  try {
    booksData = await getBooks({ page, limit, query, status });
  } catch (error) {
    console.error('Error fetching books:', error);
    booksData = {
      books: [],
      totalCount: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <BookSearchAndPagination
              currentPage={booksData.page}
              totalPages={booksData.totalPages}
              currentQuery={query}
              currentStatus={status}
              showSearchOnly={true}
            />
            <BookFormWrapper />
          </div>
        </CardHeader>
        <CardContent>
          <div className='mt-4'>
            <DataTableWrapper data={booksData.books} />
          </div>
          <div className='mt-4'>
            <BookSearchAndPagination
              currentPage={booksData.page}
              totalPages={booksData.totalPages}
              currentQuery={query}
              showPaginationOnly={true}
              booksCount={booksData.books.length}
              totalCount={booksData.totalCount}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
