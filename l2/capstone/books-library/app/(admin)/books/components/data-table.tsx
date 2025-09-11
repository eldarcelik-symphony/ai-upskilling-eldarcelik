'use client';

import { useState } from 'react';
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
import { Book, disableBook, deleteBook } from '@/lib/actions/book.actions';
import { BookForm } from './book-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface DataTableProps {
  data: Book[];
  onBookUpdate?: () => void;
}

export function DataTable({ data, onBookUpdate }: DataTableProps) {
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [bookToDisable, setBookToDisable] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const { toast } = useToast();
  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsEditFormOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditFormOpen(false);
    setEditingBook(null);
    onBookUpdate?.();
  };

  const handleEditClose = () => {
    setIsEditFormOpen(false);
    setEditingBook(null);
  };

  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book);
  };

  const handleDisableClick = (book: Book) => {
    setBookToDisable(book);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;

    setIsDeleting(true);
    try {
      await deleteBook(bookToDelete.id);
      onBookUpdate?.();
    } catch (error) {
      console.error('Error deleting book:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to delete book. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setBookToDelete(null);
    }
  };

  const confirmDisable = async () => {
    if (!bookToDisable) return;

    setIsDisabling(true);
    try {
      await disableBook(bookToDisable.id);
      toast({
        title: 'Success',
        description: 'Book disabled successfully!',
      });
      onBookUpdate?.();
    } catch (error) {
      console.error('Error disabling book:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to disable book. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsDisabling(false);
      setBookToDisable(null);
    }
  };

  const cancelDelete = () => {
    setBookToDelete(null);
  };

  const cancelDisable = () => {
    setBookToDisable(null);
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
                    <DropdownMenuItem onClick={() => handleEdit(book)}>
                      <Edit className='mr-2 h-4 w-4' />
                      Edit
                    </DropdownMenuItem>
                    {book.is_active && (
                      <DropdownMenuItem
                        onClick={() => handleDisableClick(book)}
                      >
                        <EyeOff className='mr-2 h-4 w-4' />
                        Disable
                      </DropdownMenuItem>
                    )}
                    {!book.is_active && (
                      <DropdownMenuItem
                        onClick={() => handleDisableClick(book)}
                      >
                        <Eye className='mr-2 h-4 w-4' />
                        Enable
                      </DropdownMenuItem>
                    )}
                    {book.available_copies === book.total_copies && (
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(book)}
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

      <BookForm
        isOpen={isEditFormOpen}
        onClose={handleEditClose}
        onSuccess={handleEditSuccess}
        book={editingBook}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!bookToDelete} onOpenChange={cancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{bookToDelete?.title}" by{' '}
              {bookToDelete?.author}? This action cannot be undone and will
              permanently remove the book and its cover image from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className='bg-red-600 hover:bg-red-700'
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Disable/Enable Confirmation Dialog */}
      <AlertDialog open={!!bookToDisable} onOpenChange={cancelDisable}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bookToDisable?.is_active ? 'Disable Book' : 'Enable Book'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {bookToDisable?.is_active
                ? `Are you sure you want to disable "${bookToDisable?.title}"? This will hide it from the public catalog but preserve all data.`
                : `Are you sure you want to enable "${bookToDisable?.title}"? This will make it visible in the public catalog again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDisable} disabled={isDisabling}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDisable} disabled={isDisabling}>
              {isDisabling
                ? bookToDisable?.is_active
                  ? 'Disabling...'
                  : 'Enabling...'
                : bookToDisable?.is_active
                ? 'Disable'
                : 'Enable'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
