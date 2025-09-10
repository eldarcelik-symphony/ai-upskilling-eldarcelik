import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from './components/data-table';
import { getBooks } from '@/lib/actions/book.actions';
import { BookSearchAndPagination } from '@/app/(admin)/books/components/book-search-pagination';

interface AdminBooksPageProps {
  searchParams: Promise<{
    page?: string;
    query?: string;
  }>;
}

export default async function AdminBooksPage({
  searchParams,
}: AdminBooksPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const query = params.query || '';
  const limit = 10;

  let booksData;
  try {
    booksData = await getBooks({ page, limit, query });
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
              showSearchOnly={true}
            />
            <button className='bg-gray-100 text-gray-900 font-semibold px-4 py-2 rounded-md hover:bg-gray-200 transition-colors'>
              Add New Book
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='mt-4'>
            <DataTable data={booksData.books} />
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
