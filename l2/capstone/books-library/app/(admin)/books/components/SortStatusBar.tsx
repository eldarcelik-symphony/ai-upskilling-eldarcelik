import { Button } from '@/components/ui/button';
import { SortField, SortDirection } from '@/lib/actions/book.actions';

interface SortConfig {
  field: SortField | null;
  direction: SortDirection | null;
}

interface SortStatusBarProps {
  sortConfig: SortConfig;
  onClearSort: () => void;
}

export function SortStatusBar({ sortConfig, onClearSort }: SortStatusBarProps) {
  if (!sortConfig.field) return null;

  return (
    <div className='px-4 py-2 bg-blue-50 border-b flex items-center justify-between'>
      <span className='text-sm text-blue-700'>
        Sorted by:{' '}
        <span className='font-semibold capitalize'>
          {sortConfig.field.replace('_', ' ')}
        </span>{' '}
        ({sortConfig.direction})
      </span>
      <Button
        variant='ghost'
        size='sm'
        onClick={onClearSort}
        className='h-6 px-2 text-blue-600 hover:text-blue-800'
      >
        Clear Sort
      </Button>
    </div>
  );
}
