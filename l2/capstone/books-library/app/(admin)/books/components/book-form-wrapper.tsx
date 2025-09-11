'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookForm } from './book-form';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BookFormWrapper() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    // Refresh the page to show the new book
    router.refresh();
  };

  return (
    <>
      <Button
        onClick={() => setIsFormOpen(true)}
        className='bg-primary text-primary-foreground hover:bg-primary/90'
      >
        <Plus className='mr-2 h-4 w-4' />
        Add New Book
      </Button>

      <BookForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
