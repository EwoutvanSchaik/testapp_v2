import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth = req.cookies.get('app_auth');

  // Allow login page and login API through
  if (pathname.startsWith('/login') || pathname.startsWith('/api/login')) {
    return NextResponse.next();
  }

  // Allow admin through (has its own password protection)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/feedback')) {
    if (!auth) return NextResponse.redirect(new URL('/login', req.url));
    return NextResponse.next();
  }

  if (!auth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.jpg|V2.mp4|Avatar_IV_Video.mp4|.*\\.svg).*)'],
};
