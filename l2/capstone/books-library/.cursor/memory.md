# Project Memory

## Project Overview

- **Project Name**: Books Library
- **Purpose**: Next.js application for managing a digital books library
- **Start Date**: September 2025
- **Type**: Capstone project for AI upskilling

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (based on components.json)
- **Build Tool**: Next.js with TypeScript
- **Package Manager**: npm
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with custom email verification
- **Form Validation**: Zod with react-hook-form
- **Email Service**: Resend (for custom email templates)

## Architecture Decisions

- Using Next.js App Router (app/ directory structure)
- TypeScript for type safety
- Tailwind CSS for styling with component-based approach
- shadcn/ui for consistent UI components
- ESLint for code quality
- Server Actions for form handling (signup/login)
- Database triggers for automatic user profile creation
- RLS (Row Level Security) policies for data protection

## Coding Standards

- Follow [coding_rules.mdc](mdc:.cursor/rules/coding_rules.mdc) for general development practices
- Use TypeScript strict mode
- Component-based architecture with composition
- Early returns and guard clauses for readability
- Meaningful variable and function names
- JSDoc comments for functions and components

## Requirements

Based on [PRD.txt](mdc:scripts/PRD.txt), the project implements a Book Rental Library with:

### Core Features

1. **User Authentication & Authorization**: Email/password signup with email verification, role-based access (USER/ADMIN)
2. **User Management (Admin)**: Admin dashboard for user approval workflow (PENDING/APPROVED/REJECTED)
3. **Book Management (Admin)**: Full CRUD operations with cover image upload, search, pagination
4. **Book Catalog & Borrowing (User)**: Public catalog with search, book details, borrowing system
5. **Dashboards & Profiles**: Admin dashboards, user profiles, book return functionality

### Technical Requirements

- Next.js App Router with TypeScript
- Supabase for database, auth, and file storage
- Tailwind CSS + shadcn/ui components
- React Hook Form + Zod validation
- Resend for email notifications
- Role-based route protection

## API Endpoints

### Server Actions (lib/actions/)

- **auth.actions.ts**: `logoutUser()` - User logout with redirect
- **book.actions.ts**: Complete book management operations
  - `getAllBooks()` - Paginated book listing with search/sort/filter
  - `getCatalogBooks()` - Get all books for catalog
  - `createBook()` - Create new book with cover image upload
  - `updateBook()` - Update book with smart availability calculation
  - `disableBook()` - Soft delete (set is_active = false)
  - `deleteBook()` - Hard delete (only when no borrowed copies)

### Authentication Endpoints

- **app/login/actions.ts**: `signInAction()` - User login with validation
- **app/signup/actions.ts**: `signUpAction()` - User registration with email verification

## Database Schema

### Tables

- **auth.users** (Supabase managed) - Core authentication data
- **users** (public schema) - User information including role and approval status (id, email, role, approval_status, created_at, updated_at)
- **books** - Book catalog with availability tracking (id, title, author, isbn, category, total_copies, available_copies, is_active, timestamps)
- **borrowed_books** - Book borrowing records (id, book_id, user_id, borrowed_at, returned_at, due_date, timestamps)

### Key Features

- **Automatic Functions & Triggers**:
  - User auto-creation when signing up via Supabase Auth
  - Book availability tracking (available_copies automatically updated)
  - Timestamp management (created_at/updated_at maintained automatically)
- **Performance Optimizations**:
  - Indexes on frequently queried fields (email, role, ISBN, category, due dates)
- **Security (RLS Policies)**:
  - Users can manage their own data and view all users
  - Books have public read access, authenticated users can manage
  - Borrowed books restricted to user's own records
- **Data Integrity**:
  - Foreign key relationships with cascade deletes
  - Unique constraints preventing duplicate borrowings
  - Check constraints for data validation
- **Role-based access control** (USER/ADMIN roles)
- **User approval workflow** (PENDING/APPROVED/REJECTED)

## Project Structure

```
books-library/
├── app/                 # Next.js App Router
│   ├── (admin)/        # Admin-only routes (protected by middleware)
│   │   ├── books/      # Complete book management system
│   │   │   ├── components/  # Book management UI components
│   │   │   │   ├── hooks/   # Custom hooks for book actions
│   │   │   │   └── *.tsx    # Table, forms, dialogs, search
│   │   │   └── page.tsx     # Admin books dashboard
│   │   └── layout.tsx  # Admin route protection
│   ├── catalog/        # User-facing book catalog (implemented - subtask 4.1)
│   ├── login/          # User authentication
│   ├── signup/         # User registration
│   └── page.tsx        # Home page
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── navigation*.tsx # Navigation components
├── lib/                # Utility functions
│   ├── actions/        # Server actions
│   │   ├── auth.actions.ts
│   │   └── book.actions.ts
│   ├── supabase/       # Database client & types
│   ├── auth.ts         # User role management utilities
│   └── constants.ts    # App constants (ROLES, CATEGORIES)
├── hooks/              # Custom React hooks
├── supabase/           # Database schema & migrations
│   └── schema.sql      # Complete database setup
├── scripts/            # Project scripts
│   └── PRD.txt         # Product Requirements Document
├── public/             # Static assets
└── .cursor/            # Cursor configuration
    ├── memory.md       # Project memory
    └── rules/          # Cursor rules
```

## Implementation Status

### ✅ Completed Features

- **User Authentication System**: Complete signup/login with form validation and error handling
- **Database Schema**: Complete setup with triggers, RLS policies, and comprehensive documentation
- **User Management**: Automatic profile creation with roles and approval status
- **UI Components**: shadcn/ui integration with toast notifications
- **Database Documentation**: Comprehensive README with schema features, performance optimizations, and security policies
- **Admin Book Management System**: Complete CRUD operations with advanced features
  - Server-side search, pagination, and sorting
  - Book cover image upload to Supabase Storage
  - Smart book operations (enable/disable, conditional delete)
  - ISBN uniqueness validation
  - Available copies calculation based on borrowed books
  - Advanced error handling and validation
- **Public Book Catalog**: Advanced catalog with infinite scroll and filtering
  - Infinite scroll with Intersection Observer for smooth loading
  - Debounced search by title and author (1-second delay)
  - Category filtering dropdown using predefined categories from constants
  - Availability filtering (all/available/unavailable)
  - Responsive grid display with hover effects
  - Book cover images with fallback placeholders
  - Loading states and end-of-catalog indicators
  - API endpoint for client-side data fetching
  - Search input with clear button functionality
- **Role-Based Access Control**: Complete middleware implementation protecting admin routes
- **Role-Based Home Page**: Home page redirects users based on role (admins → /books, users → /catalog)
- **Server Actions**: Comprehensive book management API with TypeScript interfaces
- **File Upload System**: Supabase Storage integration for book covers
- **Advanced UI Components**: Sortable tables, search controls, action dialogs, form validation

### 📋 Task Tracking

For current task status and progress, see [tasks.json](mdc:.taskmaster/tasks/tasks.json)

## Key Implementation Details

### Admin Book Management Features

- **Advanced Search**: Search by title, author, or category with server-side filtering
- **Smart Pagination**: Server-side pagination with configurable page sizes
- **Sortable Columns**: Server-side sorting on all book fields
- **File Upload**: Cover image upload to Supabase Storage with unique naming
- **Smart Operations**:
  - Books can only be deleted when no copies are borrowed
  - Disable/enable books instead of hard delete
  - Available copies automatically calculated based on current borrowings
- **Form Validation**: Comprehensive Zod schemas with real-time validation
- **Error Handling**: Detailed error messages and user feedback

### Architecture Patterns

- **Server Actions**: All data operations use Next.js server actions
- **Type Safety**: Complete TypeScript interfaces for all data structures
- **Component Composition**: Reusable UI components with proper separation of concerns
- **Custom Hooks**: Business logic separated into custom hooks (useBookActions, useServerSort)
- **Middleware Protection**: Route-level protection for admin functionality

### Database Integration

- **Supabase Storage**: `book-covers` bucket for image storage
- **RLS Policies**: Row-level security for data protection
- **Triggers**: Automatic timestamp management and availability tracking
- **Performance**: Indexed queries for search and pagination

## Notes

- This is a learning project focused on AI upskilling
- Using modern Next.js patterns and best practices
- Integrated with Taskmaster for project management
- Database schema is production-ready with proper error handling
- All authentication flows tested and working
- **Memory Update Rule**: Always update memory after completing tasks/subtasks
