import { Book } from '@/lib/actions/book.actions';
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

interface BookActionDialogsProps {
  // Edit form props
  editingBook: Book | null;
  isEditFormOpen: boolean;
  onEditSuccess: () => void;
  onEditClose: () => void;

  // Delete dialog props
  bookToDelete: Book | null;
  isDeleting: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;

  // Disable dialog props
  bookToDisable: Book | null;
  isDisabling: boolean;
  onConfirmDisable: () => void;
  onCancelDisable: () => void;
}

export function BookActionDialogs({
  editingBook,
  isEditFormOpen,
  onEditSuccess,
  onEditClose,
  bookToDelete,
  isDeleting,
  onConfirmDelete,
  onCancelDelete,
  bookToDisable,
  isDisabling,
  onConfirmDisable,
  onCancelDisable,
}: BookActionDialogsProps) {
  return (
    <>
      <BookForm
        isOpen={isEditFormOpen}
        onClose={onEditClose}
        onSuccess={onEditSuccess}
        book={editingBook}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!bookToDelete} onOpenChange={onCancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{bookToDelete?.title}&quot;
              by {bookToDelete?.author}? This action cannot be undone and will
              permanently remove the book and its cover image from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancelDelete} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDelete}
              disabled={isDeleting}
              className='bg-red-600 hover:bg-red-700'
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Disable/Enable Confirmation Dialog */}
      <AlertDialog open={!!bookToDisable} onOpenChange={onCancelDisable}>
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
            <AlertDialogCancel onClick={onCancelDisable} disabled={isDisabling}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDisable}
              disabled={isDisabling}
            >
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
    </>
  );
}
