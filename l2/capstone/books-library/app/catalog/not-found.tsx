import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ArrowLeft, Search } from 'lucide-react';

export default function CatalogNotFound() {
  return (
    <div className='container mx-auto px-4 py-16 max-w-2xl'>
      <Card className='text-center'>
        <CardHeader className='pb-4'>
          <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted'>
            <BookOpen className='h-10 w-10 text-muted-foreground' />
          </div>
          <CardTitle className='text-2xl font-bold text-foreground'>
            Book Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <p className='text-muted-foreground'>
              Sorry, we couldn&apos;t find the book you&apos;re looking for.
            </p>
            <p className='text-sm text-muted-foreground'>
              The book may have been removed, or the link might be incorrect.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Button asChild variant='default'>
              <Link href='/catalog' className='flex items-center gap-2'>
                <ArrowLeft className='h-4 w-4' />
                Back to Catalog
              </Link>
            </Button>
          </div>

          <div className='pt-4 border-t'>
            <p className='text-xs text-muted-foreground'>
              If you believe this is an error, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
