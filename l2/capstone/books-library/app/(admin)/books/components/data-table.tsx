'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

interface DataTableProps {
  data: Book[];
}

export function DataTable({ data }: DataTableProps) {
  const handleEdit = (bookId: string) => {
    console.log('Edit book:', bookId);
    // TODO: Implement edit functionality
  };

  const handleDelete = (bookId: string) => {
    console.log('Delete book:', bookId);
    // TODO: Implement delete functionality
  };

  const handleToggleStatus = (bookId: string) => {
    console.log('Toggle status for book:', bookId);
    // TODO: Implement toggle status functionality
  };

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Cover</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className='text-center'>Total Copies</TableHead>
            <TableHead className='text-center'>Available</TableHead>
            <TableHead className='text-center'>Status</TableHead>
            <TableHead className='w-[100px]'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((book) => (
            <TableRow key={book.id}>
              <TableCell>
                <div className='w-16 h-20 bg-gray-100 rounded-md flex items-center justify-center'>
                  {book.cover_image_url ? (
                    <Image
                      src={book.cover_image_url}
                      alt={book.title}
                      width={64}
                      height={80}
                      className='object-cover rounded-md'
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
                    book.available_copies > 0
                      ? 'text-green-600'
                      : 'text-red-600'
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
                    <DropdownMenuItem onClick={() => handleEdit(book.id)}>
                      <Edit className='mr-2 h-4 w-4' />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleToggleStatus(book.id)}
                    >
                      {book.is_active ? (
                        <>
                          <EyeOff className='mr-2 h-4 w-4' />
                          Disable
                        </>
                      ) : (
                        <>
                          <Eye className='mr-2 h-4 w-4' />
                          Enable
                        </>
                      )}
                    </DropdownMenuItem>
                    {book.available_copies === book.total_copies && (
                      <DropdownMenuItem
                        onClick={() => handleDelete(book.id)}
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
      </Table>
    </div>
  );
}
