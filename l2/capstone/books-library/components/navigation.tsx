import { getUserWithRole, logoutUser } from '@/lib/auth';
import Link from 'next/link';

export async function Navigation() {
  const user = await getUserWithRole();

  return (
    <nav className='bg-white shadow-sm border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <Link href='/' className='text-xl font-semibold text-gray-900'>
              Books Library
            </Link>
          </div>

          <div className='flex items-center space-x-4'>
            {user ? (
              <>
                <span className='text-sm text-gray-700'>
                  Welcome, {user.email}
                </span>
                {user.role === 'ADMIN' && (
                  <Link
                    href='/admin'
                    className='text-sm text-gray-500 hover:text-gray-700'
                  >
                    Admin
                  </Link>
                )}
                <form action={logoutUser}>
                  <button
                    type='submit'
                    className='text-sm text-red-600 hover:text-red-700'
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href='/login'
                  className='text-sm text-gray-500 hover:text-gray-700 cursor-pointer'
                >
                  Login
                </Link>
                <Link
                  href='/signup'
                  className='text-sm text-blue-600 hover:text-blue-700 cursor-pointer'
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
