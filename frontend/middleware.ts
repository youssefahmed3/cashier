import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateToken } from './lib/api/auth';
import type { validateTokenResult } from './types/types';

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/forgetPassword',
  '/resetPassword',
  '/validateResetPasswordCode',
  '/confirmTwoFactorAuth'
];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const path = request.nextUrl.pathname;

  const isPublic = PUBLIC_PATHS.some(
    publicPath => path === publicPath || path.startsWith(`${publicPath}/`)
  );

  // If no token
  if (!token) {
    return isPublic
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/login', request.url));
  }

  // Validate token
  const validationResult: validateTokenResult = await validateToken(token);

  if (!validationResult.success || !validationResult.claims) {
    return isPublic
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/login', request.url));
  }

  const role = validationResult.claims.roles;
  const userRoles = Array.isArray(role) ? role : (role ? [role] : []);

  // Handle users without a role -> OnBoarding
  if (userRoles.length === 0) {
    if (path.startsWith('/OnBoarding')) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/OnBoarding', request.url));
  }

  // Handle redirect from public pages for logged-in users
  if (isPublic) {
    if (userRoles.includes('SuperAdmin')) return NextResponse.redirect(new URL('/superadmin', request.url));
    if (userRoles.includes('Admin')) return NextResponse.redirect(new URL('/tenant', request.url));
    if (userRoles.includes('Cashier')) return NextResponse.redirect(new URL('/cashier', request.url));
    // Fallback for a user with a role but no specific dashboard redirect defined above
    return NextResponse.redirect(new URL('/not-authorized', request.url));
  }

  // Handle authorization for protected paths
  const rolePermissions: Record<string, string[]> = {
    SuperAdmin: ['/superadmin', '/notifications'],
    Admin: ['/tenant', '/cashier'],
    Cashier: ['/cashier'],
  };

  const isAuthorized = userRoles.some(userRole => {
    const allowedPaths = rolePermissions[userRole] || [];
    return allowedPaths.some(allowedPath => path.startsWith(allowedPath));
  });

  // Allow access to the not-authorized page itself to prevent loops
  if (isAuthorized || path === '/not-authorized') {
    return NextResponse.next();
  }

  // If not authorized for a protected path, redirect
  return NextResponse.redirect(new URL('/not-authorized', request.url));
""
}

// Apply to all routes except static files and API
/* export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}; */
export const config = {
  matcher: [
    /*
     * Middleware applies to all routes except:
     * - _next/static/*
     * - _next/image/*
     * - favicon.ico
     * - image extensions like .png, .jpg, etc.
     */
    '/((?!_next/static/|_next/image/|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.gif$|.*\\.webp$).*)',
  ],
};