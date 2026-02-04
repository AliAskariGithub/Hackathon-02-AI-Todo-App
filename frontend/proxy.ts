import { NextRequest, NextResponse } from 'next/server';

// Define protected routes - commented out since we handle auth client-side
// const protectedRoutes = ['/dashboard'];

export function proxy(request: NextRequest) {
  // Only apply protection to API routes, not to page routes
  // Page route authentication is handled client-side
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  if (isApiRoute) {
    // For API routes, check for authentication token
    let token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      token = request.cookies.get('auth-token')?.value;
    }

    // If this is an API route that requires authentication (excluding public routes like login/register)
    const isPublicApiRoute = request.nextUrl.pathname.includes('/login') ||
                            request.nextUrl.pathname.includes('/register');

    // If it's a protected API route and no token is found, return unauthorized
    if (!isPublicApiRoute && !token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
  }

  // Continue with the request for all other cases
  return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};