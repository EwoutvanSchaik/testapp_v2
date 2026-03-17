import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth = req.cookies.get('app_auth');

  // Authenticated: allow through
  if (auth) return NextResponse.next();

  // Unauthenticated: only /login and /api/login are accessible
  if (pathname.startsWith('/login') || pathname.startsWith('/api/login')) {
    return NextResponse.next();
  }

  // Everything else → redirect to login
  return NextResponse.redirect(new URL('/login', req.url));
}

export const config = {
  // Run middleware on all routes EXCEPT Next.js internals and static public files
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|mp3|woff2?|ttf)$).*)',
  ],
};
