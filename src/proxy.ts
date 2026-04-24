import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    // Optimistic checking of the session token.
    // Better Auth uses "better-auth.session_token" locally or prefixed with "__Secure-" in production.
    const hasSessionToken = request.cookies.get("better-auth.session_token") || 
                            request.cookies.get("__Secure-better-auth.session_token");

    if (!hasSessionToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
};
