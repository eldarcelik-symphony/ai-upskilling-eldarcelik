import { getUserWithRole, ROLES } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserWithRole();

  if (!user || user.role !== ROLES.ADMIN) {
    redirect('/');
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation />
      <main className='container mx-auto px-4 py-6'>{children}</main>
    </div>
  );
}
