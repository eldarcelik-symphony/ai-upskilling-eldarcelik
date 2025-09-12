'use client';

import { usePathname } from 'next/navigation';
import { logoutUser } from '@/lib/actions/auth.actions';
import Link from 'next/link';
import { UserWithRole } from '@/lib/auth';
import { NavigationAuth, NavigationRoutes } from './navigation';

interface NavigationWrapperProps {
  user: UserWithRole | null;
}

export function NavigationWrapper({ user }: NavigationWrapperProps) {
  const pathname = usePathname();

  // Don't show navigation on login/signup pages
  const hideNavigation = pathname === '/login' || pathname === '/signup';

  if (hideNavigation) {
    return null;
  }

  return (
    <nav className='bg-white shadow-sm border-b'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-8'>
            <Link href='/' className='text-2xl font-bold text-gray-900'>
              Books Library
            </Link>
            <NavigationRoutes user={user} />
          </div>
          <div className='flex items-center'>
            <NavigationAuth user={user} logoutUser={logoutUser} />
          </div>
        </div>
      </div>
    </nav>
  );
}
