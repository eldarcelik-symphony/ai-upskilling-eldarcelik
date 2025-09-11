'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createBook, updateBook } from '@/lib/actions/book.actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { CATEGORIES } from '@/lib/constants';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  author: z
    .string()
    .min(1, 'Author is required')
    .max(255, 'Author name is too long'),
  isbn: z.string().min(1, 'ISBN is required').max(20, 'ISBN is too long'),
  category: z.string().min(1, 'Category is required'),
  total_copies: z.coerce
    .number()
    .min(1, 'Must have at least 1 copy')
    .max(1000, 'Too many copies'),
  coverImage: z.union([z.instanceof(File), z.null()]).optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  book?: {
    id: string;
    title: string;
    author: string;
    isbn: string;
    category: string;
    total_copies: number;
    cover_image_url?: string | null;
  } | null;
}

export function BookForm({ isOpen, onClose, onSuccess, book }: BookFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title || '',
      author: book?.author || '',
      isbn: book?.isbn || '',
      category: book?.category || '',
      total_copies: book?.total_copies || 1,
      coverImage: undefined,
    },
  });

  // Reset form and preview when book changes or dialog opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setPreviewImage(null);
      if (book) {
        form.reset({
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          category: book.category,
          total_copies: book.total_copies,
          coverImage: undefined,
        });
      } else {
        form.reset({
          title: '',
          author: '',
          isbn: '',
          category: '',
          total_copies: 1,
          coverImage: undefined,
        });
      }
    }
  }, [isOpen, book, form]);

  const handleImageChange = (file: File | null) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file.',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const onSubmit = async (data: BookFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('author', data.author);
      formData.append('isbn', data.isbn);
      formData.append('category', data.category);
      formData.append('total_copies', data.total_copies.toString());

      if (data.coverImage && data.coverImage instanceof File) {
        formData.append('coverImage', data.coverImage);
      }

      if (book) {
        // Update existing book
        await updateBook(book.id, formData);
      } else {
        // Create new book
        await createBook(formData);
      }

      form.reset({
        title: '',
        author: '',
        isbn: '',
        category: '',
        total_copies: 1,
        coverImage: undefined,
      });
      setPreviewImage(null);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving book:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to ${book ? 'update' : 'create'} book. Please try again.`;
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset({
        title: '',
        author: '',
        isbn: '',
        category: '',
        total_copies: 1,
        coverImage: undefined,
      });
      setPreviewImage(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{book ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            {book
              ? 'Update the book details below.'
              : 'Fill in the details below to add a new book to the library.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter book title' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='author'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author *</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter author name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isbn'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN *</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter ISBN' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='total_copies'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Copies *</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min='1'
                        max='1000'
                        placeholder='Enter number of copies'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='coverImage'
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        <div className='flex items-center gap-4'>
                          <div className='relative'>
                            <Input
                              type='file'
                              accept='image/*'
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                onChange(file);
                                handleImageChange(file);
                              }}
                              className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                              id='cover-image-input'
                            />
                            <label
                              htmlFor='cover-image-input'
                              className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer'
                            >
                              <Upload className='mr-2 h-4 w-4' />
                              Choose File
                            </label>
                          </div>
                          {previewImage && (
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                setPreviewImage(null);
                                onChange(null);
                                // Reset the file input
                                const fileInput = document.getElementById(
                                  'cover-image-input'
                                ) as HTMLInputElement;
                                if (fileInput) fileInput.value = '';
                              }}
                            >
                              <X className='h-4 w-4' />
                            </Button>
                          )}
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          {previewImage ? 'Image selected' : 'No file chosen'}
                        </div>
                      </div>

                      {previewImage && (
                        <div className='relative w-32 h-40 border rounded-md overflow-hidden'>
                          <Image
                            src={previewImage}
                            alt='Cover preview'
                            fill
                            className='object-cover'
                          />
                        </div>
                      )}

                      {book?.cover_image_url && !previewImage && (
                        <div className='relative w-32 h-40 border rounded-md overflow-hidden'>
                          <Image
                            src={book.cover_image_url}
                            alt='Current cover'
                            fill
                            className='object-cover'
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                {book ? 'Update Book' : 'Create Book'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
