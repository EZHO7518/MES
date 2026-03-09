import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/dashboard', '/products', '/quotations', '/checks'];

export function middleware(req: NextRequest) {
  if (!protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get('mes_session')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/products/:path*', '/quotations/:path*', '/checks/:path*'],
};
