import {
  getUserWithRole,
  ROLES,
  APPROVAL_STATUS,
  logoutUser,
} from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  // This page should only be accessible to ADMIN users
  // The middleware will handle the role check, but we can also verify here
  const user = await getUserWithRole();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== ROLES.ADMIN) {
    redirect('/');
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-4xl mx-auto px-4'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>
          Admin Dashboard
        </h1>

        <div className='bg-white shadow-lg rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Welcome, Admin!
          </h2>
          <p className='text-gray-600 mb-4'>
            You have successfully accessed the admin area. This page is
            protected by middleware that ensures only users with the 'ADMIN'
            role can access it.
          </p>

          <div className='space-y-2'>
            <p>
              <strong>User ID:</strong> {user.id}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong>{' '}
              <span className='px-2 py-1 bg-red-100 text-red-800 rounded text-sm'>
                {user.role}
              </span>
            </p>
            <p>
              <strong>Approval Status:</strong>{' '}
              <span
                className={`px-2 py-1 rounded text-sm ${
                  user.approval_status === APPROVAL_STATUS.APPROVED
                    ? 'bg-green-100 text-green-800'
                    : user.approval_status === APPROVAL_STATUS.PENDING
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {user.approval_status}
              </span>
            </p>
          </div>
        </div>

        <div className='mt-6 flex space-x-4'>
          <a
            href='/'
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
          >
            Back to Home
          </a>
          <form action={logoutUser}>
            <button
              type='submit'
              className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
