import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Paths that require authentication
const authRequiredPaths = [
  '/dashboard',
  '/profile',
  '/gyms/create',
  '/gyms/edit',
  '/admin',
];

// Admin-only paths
const adminPaths = [
  '/admin',
];

// Gym owner only paths
const gymOwnerPaths = [
  '/dashboard',
  '/gyms/create',
  '/gyms/edit',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path requires authentication
  const isAuthRequired = authRequiredPaths.some(path => 
    pathname.startsWith(path)
  );
  
  // Check if the path is admin-only
  const isAdminPath = adminPaths.some(path => 
    pathname.startsWith(path)
  );
  
  // Check if the path is gym-owner-only
  const isGymOwnerPath = gymOwnerPaths.some(path => 
    pathname.startsWith(path)
  );
  
  // If no authentication is required, proceed
  if (!isAuthRequired) {
    return NextResponse.next();
  }
  
  // Get the token and user role
  const token = await getToken({ req: request });
  
  // If no token, redirect to login
  if (!token) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  // Check user role for admin paths
  if (isAdminPath && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Check user role for gym owner paths
  if (isGymOwnerPath && token.role !== 'GYM_OWNER') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Proceed with the request
  return NextResponse.next();
}

// Configure matcher to run middleware only on specific paths
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