import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

type JWTPayload = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    isSuspended: boolean;
    phoneNumber: string;
    roles: string[];
};
export async function middleware(request: NextRequest) {
    /*     const token = request.cookies.get('auth-token')?.value;
        const path = request.nextUrl.pathname;
    
        // If not logged in → redirect to /login (except for /login itself)
        if (!token && path !== '/login') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    
        if (!token) return NextResponse.next(); // allow /login to load
    
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET) as { payload: JWTPayload };
            const roles = payload.roles || [];
    
            // SuperAdmin-only routes
            if (path.startsWith('/superadmin') && !roles.includes('SuperAdmin')) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
    
            // Admin-only routes
            if (path.startsWith('/tenant') && !roles.includes('Admin')) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
    
            // Cashier-only routes
            if (path.startsWith('/cashier') && !roles.includes('Cashier')) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
    
            return NextResponse.next();
        } catch (err) {
            return NextResponse.redirect(new URL('/login', request.url));
        } */

    return NextResponse.next();
}

/* export const config = {
    matcher: [
        '/superadmin/:path*',
        '/tenant/:path*',
        '/cashier/:path*',
        '/login',
    ],
}; */