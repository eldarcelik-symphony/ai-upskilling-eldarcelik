import { notFound } from 'next/navigation';
import { getBookById } from '@/lib/actions/book.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { BookOpen, Calendar, Hash, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDateLong } from '@/lib/utils/date';

interface BookDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-6xl'>
      {/* Two-column layout */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Left column - Book cover */}
        <div className='space-y-4'>
          <Card className='overflow-hidden'>
            <div className='aspect-[3/4] relative bg-muted'>
              {book.cover_image_url ? (
                <Image
                  src={book.cover_image_url}
                  alt={`${book.title} cover`}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
              ) : (
                <div className='flex items-center justify-center h-full'>
                  <BookOpen className='h-24 w-24 text-muted-foreground' />
                </div>
              )}
            </div>
          </Card>

          {/* Availability status */}
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Availability</span>
                <Badge
                  variant={book.available_copies > 0 ? 'default' : 'secondary'}
                  className={
                    book.available_copies > 0
                      ? 'bg-green-100 text-green-800'
                      : ''
                  }
                >
                  {book.available_copies > 0
                    ? `${book.available_copies} of ${book.total_copies} available`
                    : 'All copies borrowed'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Book details */}
        <div className='space-y-6'>
          {/* Title and author */}
          <div>
            <h1 className='text-3xl font-bold text-foreground mb-2'>
              {book.title}
            </h1>
            <p className='text-xl text-muted-foreground flex items-center gap-2'>
              <User className='h-5 w-5' />
              {book.author}
            </p>
          </div>

          {/* Category */}
          <div>
            <Badge variant='outline' className='text-sm'>
              {book.category}
            </Badge>
          </div>

          {/* Book details */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Book Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-3'>
                <Hash className='h-4 w-4 text-muted-foreground' />
                <div>
                  <span className='text-sm font-medium'>ISBN:</span>
                  <span className='ml-2 font-mono text-sm'>{book.isbn}</span>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <BookOpen className='h-4 w-4 text-muted-foreground' />
                <div>
                  <span className='text-sm font-medium'>Total Copies:</span>
                  <span className='ml-2'>{book.total_copies}</span>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <div>
                  <span className='text-sm font-medium'>Added:</span>
                  <span className='ml-2'>
                    {formatDateLong(book.created_at)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Borrow button placeholder - will be implemented in future tasks */}
          <Card>
            <CardContent className='p-6'>
              <div className='text-center'>
                <p className='text-muted-foreground mb-4'>
                  Borrowing functionality will be available soon
                </p>
                <div className='w-full h-10 bg-muted rounded-md flex items-center justify-center'>
                  <span className='text-sm text-muted-foreground'>
                    Borrow Button (Coming Soon)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
