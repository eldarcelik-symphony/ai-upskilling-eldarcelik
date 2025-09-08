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

- [To be documented as requirements are gathered from PRD]

## API Endpoints

- [To be documented as APIs are designed]

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
│   ├── signup/         # User registration
│   ├── login/          # User authentication
│   └── test-supabase/  # Database testing
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui components
├── lib/                # Utility functions
│   └── supabase/       # Database client & types
├── supabase/           # Database schema & migrations
│   └── schema.sql      # Complete database setup
├── public/             # Static assets
└── .cursor/            # Cursor configuration
    ├── memory.md       # Project memory
    └── rules/          # Cursor rules
```

## Implementation Status

### ✅ Completed

- **User Authentication System**: Signup/login with form validation
- **Database Schema**: Complete setup with triggers, RLS policies, and comprehensive documentation
- **User Management**: Automatic profile creation with roles and approval status
- **UI Components**: shadcn/ui integration with toast notifications
- **Database Documentation**: Comprehensive README with schema features, performance optimizations, and security policies

### 🚧 In Progress

- **Task 2**: User Authentication and Role-Based Access (2/5 subtasks completed)

### 📋 Next Steps

- Integrate Resend for custom email verification
- Implement role-based access control middleware
- Create server-side utility for user role fetching

## Notes

- This is a learning project focused on AI upskilling
- Using modern Next.js patterns and best practices
- Integrated with Taskmaster for project management
- Database schema is production-ready with proper error handling
- All authentication flows tested and working
