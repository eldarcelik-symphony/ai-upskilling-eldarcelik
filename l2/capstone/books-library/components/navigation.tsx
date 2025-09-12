'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ROLES } from '@/lib/constants';
import { User, LogOut } from 'lucide-react';

export type AuthUser = {
  id: string;
  email?: string;
  role: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

interface NavigationRoutesProps {
  user: AuthUser | null;
}

interface NavigationAuthProps extends NavigationRoutesProps {
  logoutUser: () => void;
}

export function NavigationRoutes({ user }: NavigationRoutesProps) {
  const pathname = usePathname();

  const getLinkClassName = (href: string, isSignUp = false) => {
    const isActive = pathname === href;
    const baseClasses =
      'text-sm cursor-pointer transition-colors px-3 py-2 rounded-md';

    if (isSignUp) {
      return `${baseClasses} ${
        isActive
          ? 'text-blue-800 font-semibold bg-blue-50'
          : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
      }`;
    }

    return `${baseClasses} ${
      isActive
        ? 'text-gray-900 font-semibold bg-gray-100'
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
    }`;
  };

  return (
    <div className='flex items-center space-x-2'>
      <Link href='/catalog' className={getLinkClassName('/catalog')}>
        Catalog
      </Link>
      {user && user.role === ROLES.ADMIN && (
        <Link href='/books' className={getLinkClassName('/books')}>
          Books
        </Link>
      )}
    </div>
  );
}

export function NavigationAuth({ user, logoutUser }: NavigationAuthProps) {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getLinkClassName = (href: string, isSignUp = false) => {
    const isActive = pathname === href;
    const baseClasses =
      'text-sm cursor-pointer transition-colors px-3 py-2 rounded-md';

    if (isSignUp) {
      return `${baseClasses} ${
        isActive
          ? 'text-blue-800 font-semibold bg-blue-50'
          : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
      }`;
    }

    return `${baseClasses} ${
      isActive
        ? 'text-gray-900 font-semibold bg-gray-100'
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
    }`;
  };

  if (!user) {
    return (
      <div className='flex items-center space-x-2'>
        <Link href='/login' className={getLinkClassName('/login')}>
          Login
        </Link>
        <Link href='/signup' className={getLinkClassName('/signup', true)}>
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className='flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors'
      >
        <User className='w-4 h-4 text-gray-600' />
      </button>
      {isDropdownOpen && (
        <div className='absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50'>
          <div className='px-4 py-2 border-b border-gray-100'>
            <p className='text-sm font-medium text-gray-900'>{user.email}</p>
            <p className='text-xs text-gray-500 capitalize'>
              {user.role.toLowerCase()}
            </p>
          </div>
          <form action={logoutUser}>
            <button
              type='submit'
              className='w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors'
            >
              <LogOut className='w-4 h-4 mr-2' />
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
