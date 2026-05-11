import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isOfficerRoute = pathname.startsWith('/officer');
  
  if (isAdminRoute || isOfficerRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (isAdminRoute && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (isOfficerRoute && token.role !== 'OFFICER' && token.role !== 'ADMIN' && token.role !== 'DEPARTMENT_HEAD') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/officer/:path*'],
};
