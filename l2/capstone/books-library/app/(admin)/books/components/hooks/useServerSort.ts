import { useRouter, useSearchParams } from 'next/navigation';
import { SortField, SortDirection } from '@/lib/actions/book.actions';

export function useServerSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSortField = searchParams.get('sortField') as SortField | null;
  const currentSortDirection = (searchParams.get('sortDirection') as SortDirection) || 'asc';

  const handleSort = (field: SortField) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (currentSortField === field) {
      // Cycle through: asc -> desc -> null
      if (currentSortDirection === 'asc') {
        params.set('sortDirection', 'desc');
      } else if (currentSortDirection === 'desc') {
        params.delete('sortField');
        params.delete('sortDirection');
      }
    } else {
      // New field, start with ascending
      params.set('sortField', field);
      params.set('sortDirection', 'asc');
    }

    // Reset to page 1 when sorting
    params.set('page', '1');
    
    router.push(`?${params.toString()}`);
  };

  const clearSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('sortField');
    params.delete('sortDirection');
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  return {
    sortConfig: {
      field: currentSortField,
      direction: currentSortField ? currentSortDirection : null,
    },
    handleSort,
    clearSort,
  };
}
