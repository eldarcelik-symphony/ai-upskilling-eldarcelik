'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Server action to sign out the current user and redirect.
 */
export async function logoutUser() {
  const supabase = await createClient();
  
  await supabase.auth.signOut();
  
  redirect('/');
}
