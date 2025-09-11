'use client';

import { DataTable } from './data-table';
import { Book } from '@/lib/actions/book.actions';

interface DataTableWrapperProps {
  data: Book[];
}

export function DataTableWrapper({ data }: DataTableWrapperProps) {
  const handleBookUpdate = () => {
    // This will trigger a page refresh to show updated data
    window.location.reload();
  };

  return <DataTable data={data} onBookUpdate={handleBookUpdate} />;
}
