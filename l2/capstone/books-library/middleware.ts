import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ROLES } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the request path starts with /admin
  if (pathname.startsWith('/admin')) {
    try {
      // Create Supabase client
      const supabase = await createClient();
      
      // Get the current user session
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      // If no user session, redirect to login
      if (authError || !user) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // Query the users table for the current user's role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      
      // If user not found in users table or error occurred, redirect to login
      if (userError || !userData) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // If user's role is not 'ADMIN', redirect to homepage
      if (userData.role !== ROLES.ADMIN) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      
    } catch (error) {
      // If any error occurs, redirect to login
      console.error('Middleware error:', error);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
