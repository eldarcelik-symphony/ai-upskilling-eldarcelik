'use client';

import { Table } from '@/components/ui/table';
import { Book } from '@/lib/actions/book.actions';
import { useServerSort } from './hooks/useServerSort';
import { useBookActions } from './hooks/useBookActions';
import { SortableTableHeader } from './SortableTableHeader';
import { BookTableRow } from './BookTableRow';
import { BookActionDialogs } from './BookActionDialogs';
import { SortStatusBar } from './SortStatusBar';

interface DataTableProps {
  data: Book[];
  onBookUpdate?: () => void;
}

export function DataTable({ data, onBookUpdate }: DataTableProps) {
  const { sortConfig, handleSort, clearSort } = useServerSort();
  const {
    editingBook,
    isEditFormOpen,
    bookToDelete,
    bookToDisable,
    isDeleting,
    isDisabling,
    handleEdit,
    handleEditSuccess,
    handleEditClose,
    handleDeleteClick,
    handleDisableClick,
    confirmDelete,
    confirmDisable,
    cancelDelete,
    cancelDisable,
  } = useBookActions(onBookUpdate);

  return (
    <div className='rounded-md border'>
      <SortStatusBar sortConfig={sortConfig} onClearSort={clearSort} />

      <Table>
        <SortableTableHeader sortConfig={sortConfig} onSort={handleSort} />
        <BookTableRow
          books={data}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onDisable={handleDisableClick}
        />
      </Table>

      <BookActionDialogs
        editingBook={editingBook}
        isEditFormOpen={isEditFormOpen}
        onEditSuccess={handleEditSuccess}
        onEditClose={handleEditClose}
        bookToDelete={bookToDelete}
        isDeleting={isDeleting}
        onConfirmDelete={confirmDelete}
        onCancelDelete={cancelDelete}
        bookToDisable={bookToDisable}
        isDisabling={isDisabling}
        onConfirmDisable={confirmDisable}
        onCancelDisable={cancelDisable}
      />
    </div>
  );
}
