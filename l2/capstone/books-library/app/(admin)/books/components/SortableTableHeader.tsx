import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortField, SortDirection } from '@/lib/actions/book.actions';

interface SortConfig {
  field: SortField | null;
  direction: SortDirection | null;
}

interface SortableTableHeaderProps {
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
}

export function SortableTableHeader({
  sortConfig,
  onSort,
}: SortableTableHeaderProps) {
  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className='h-4 w-4 opacity-50' />;
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className='h-4 w-4 text-blue-600' />;
    }
    if (sortConfig.direction === 'desc') {
      return <ArrowDown className='h-4 w-4 text-blue-600' />;
    }
    return <ArrowUpDown className='h-4 w-4 opacity-50' />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className='w-[100px]'>Cover</TableHead>
        <TableHead>
          <Button
            variant='ghost'
            onClick={() => onSort('title')}
            className={`h-auto p-0 font-semibold hover:bg-transparent ${
              sortConfig.field === 'title' ? 'text-blue-600' : ''
            }`}
            aria-label={`Sort by title ${
              sortConfig.field === 'title' ? `(${sortConfig.direction})` : ''
            }`}
          >
            <span className='flex items-center gap-2'>
              Title
              {getSortIcon('title')}
            </span>
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant='ghost'
            onClick={() => onSort('author')}
            className={`h-auto p-0 font-semibold hover:bg-transparent ${
              sortConfig.field === 'author' ? 'text-blue-600' : ''
            }`}
            aria-label={`Sort by author ${
              sortConfig.field === 'author' ? `(${sortConfig.direction})` : ''
            }`}
          >
            <span className='flex items-center gap-2'>
              Author
              {getSortIcon('author')}
            </span>
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant='ghost'
            onClick={() => onSort('isbn')}
            className={`h-auto p-0 font-semibold hover:bg-transparent ${
              sortConfig.field === 'isbn' ? 'text-blue-600' : ''
            }`}
            aria-label={`Sort by ISBN ${
              sortConfig.field === 'isbn' ? `(${sortConfig.direction})` : ''
            }`}
          >
            <span className='flex items-center gap-2'>
              ISBN
              {getSortIcon('isbn')}
            </span>
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant='ghost'
            onClick={() => onSort('category')}
            className={`h-auto p-0 font-semibold hover:bg-transparent ${
              sortConfig.field === 'category' ? 'text-blue-600' : ''
            }`}
            aria-label={`Sort by category ${
              sortConfig.field === 'category' ? `(${sortConfig.direction})` : ''
            }`}
          >
            <span className='flex items-center gap-2'>
              Category
              {getSortIcon('category')}
            </span>
          </Button>
        </TableHead>
        <TableHead className='text-center'>
          <Button
            variant='ghost'
            onClick={() => onSort('total_copies')}
            className={`h-auto p-0 font-semibold hover:bg-transparent ${
              sortConfig.field === 'total_copies' ? 'text-blue-600' : ''
            }`}
            aria-label={`Sort by total copies ${
              sortConfig.field === 'total_copies'
                ? `(${sortConfig.direction})`
                : ''
            }`}
          >
            <span className='flex items-center gap-2 justify-center'>
              Total Copies
              {getSortIcon('total_copies')}
            </span>
          </Button>
        </TableHead>
        <TableHead className='text-center'>
          <Button
            variant='ghost'
            onClick={() => onSort('available_copies')}
            className={`h-auto p-0 font-semibold hover:bg-transparent ${
              sortConfig.field === 'available_copies' ? 'text-blue-600' : ''
            }`}
            aria-label={`Sort by available copies ${
              sortConfig.field === 'available_copies'
                ? `(${sortConfig.direction})`
                : ''
            }`}
          >
            <span className='flex items-center gap-2 justify-center'>
              Available
              {getSortIcon('available_copies')}
            </span>
          </Button>
        </TableHead>
        <TableHead className='text-center'>
          <Button
            variant='ghost'
            onClick={() => onSort('is_active')}
            className={`h-auto p-0 font-semibold hover:bg-transparent ${
              sortConfig.field === 'is_active' ? 'text-blue-600' : ''
            }`}
            aria-label={`Sort by status ${
              sortConfig.field === 'is_active'
                ? `(${sortConfig.direction})`
                : ''
            }`}
          >
            <span className='flex items-center gap-2 justify-center'>
              Status
              {getSortIcon('is_active')}
            </span>
          </Button>
        </TableHead>
        <TableHead className='w-[100px]'>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
