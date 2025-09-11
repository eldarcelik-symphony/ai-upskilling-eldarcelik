import { useState } from 'react';
import { Book, disableBook, deleteBook } from '@/lib/actions/book.actions';
import { useToast } from '@/hooks/use-toast';

export function useBookActions(onBookUpdate?: () => void) {
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

  return {
    // State
    editingBook,
    isEditFormOpen,
    bookToDelete,
    bookToDisable,
    isDeleting,
    isDisabling,
    // Actions
    handleEdit,
    handleEditSuccess,
    handleEditClose,
    handleDeleteClick,
    handleDisableClick,
    confirmDelete,
    confirmDisable,
    cancelDelete,
    cancelDisable,
  };
}
