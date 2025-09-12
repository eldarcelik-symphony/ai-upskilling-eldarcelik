import { getUserWithRole, ROLES } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getUserWithRole();

  if (user?.role === ROLES.ADMIN) {
    redirect('/books');
  } else {
    redirect('/catalog');
  }
}
