import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { Book } from '@/lib/actions/book.actions';

interface BookTableRowProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onDisable: (book: Book) => void;
}

export function BookTableRow({
  books,
  onEdit,
  onDelete,
  onDisable,
}: BookTableRowProps) {
  return (
    <TableBody>
      {books.map((book) => (
        <TableRow
          key={book.id}
          className={!book.is_active ? 'opacity-60 bg-gray-50' : ''}
        >
          <TableCell>
            <div className='w-16 h-20 bg-gray-100 rounded-md flex items-center justify-center'>
              {book.cover_image_url ? (
                <Image
                  src={book.cover_image_url}
                  alt={book.title}
                  width={64}
                  height={80}
                  className={`object-cover rounded-md ${
                    !book.is_active ? 'grayscale' : ''
                  }`}
                />
              ) : (
                <div className='text-gray-400 text-xs text-center'>
                  No Cover
                </div>
              )}
            </div>
          </TableCell>
          <TableCell className='font-medium'>{book.title}</TableCell>
          <TableCell>{book.author}</TableCell>
          <TableCell className='font-mono text-sm text-gray-600'>
            {book.isbn}
          </TableCell>
          <TableCell>
            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
              {book.category}
            </span>
          </TableCell>
          <TableCell className='text-center'>{book.total_copies}</TableCell>
          <TableCell className='text-center'>
            <span
              className={`font-medium ${
                book.available_copies > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {book.available_copies}
            </span>
          </TableCell>
          <TableCell className='text-center'>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                book.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {book.is_active ? 'Active' : 'Inactive'}
            </span>
          </TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Open menu</span>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => onEdit(book)}>
                  <Edit className='mr-2 h-4 w-4' />
                  Edit
                </DropdownMenuItem>
                {book.is_active && (
                  <DropdownMenuItem onClick={() => onDisable(book)}>
                    <EyeOff className='mr-2 h-4 w-4' />
                    Disable
                  </DropdownMenuItem>
                )}
                {!book.is_active && (
                  <DropdownMenuItem onClick={() => onDisable(book)}>
                    <Eye className='mr-2 h-4 w-4' />
                    Enable
                  </DropdownMenuItem>
                )}
                {book.available_copies === book.total_copies && (
                  <DropdownMenuItem
                    onClick={() => onDelete(book)}
                    className='text-red-600'
                  >
                    <Trash2 className='mr-2 h-4 w-4' />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
