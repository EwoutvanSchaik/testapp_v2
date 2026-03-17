import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow: login page, login API
  if (pathname === '/login' || pathname.startsWith('/api/login')) {
    return NextResponse.next();
  }

  // Check auth cookie (.value required in Next.js 15+)
  const auth = request.cookies.get('app_auth')?.value;

  if (!auth) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - public folder files (images, video, fonts)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|logo\\.jpg|V2\\.mp4|Avatar_IV_Video\\.mp4|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|woff2?)$).*)',
  ],
};
