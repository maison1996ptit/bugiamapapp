import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const isAdminRoute = pathname.startsWith('/admin');
  const isOfficerRoute = pathname.startsWith('/officer');
  
  if (isAdminRoute || isOfficerRoute) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = token.role as string;

    if (isAdminRoute && userRole !== 'ADMIN') {
      console.warn(`Unauthorized admin access attempt to ${pathname} by user with role ${userRole}`);
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (isOfficerRoute && !['OFFICER', 'ADMIN', 'DEPARTMENT_HEAD'].includes(userRole)) {
      console.warn(`Unauthorized officer access attempt to ${pathname} by user with role ${userRole}`);
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/officer/:path*'],
};
