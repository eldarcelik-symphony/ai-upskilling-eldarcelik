import { getUserWithRole } from '@/lib/auth';
import { logoutUser } from '@/lib/actions/auth.actions';
import Link from 'next/link';
import {
  NavigationClient,
  NavigationAuth,
} from '@/components/navigation-client';

export async function Navigation() {
  const user = await getUserWithRole();

  return (
    <nav className='bg-white shadow-sm border-b'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-8'>
            <Link href='/' className='text-2xl font-bold text-gray-900'>
              Books Library
            </Link>
            <NavigationClient user={user} logoutUser={logoutUser} />
          </div>
          <div className='flex items-center'>
            <NavigationAuth user={user} logoutUser={logoutUser} />
          </div>
        </div>
      </div>
    </nav>
  );
}
