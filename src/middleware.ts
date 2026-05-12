import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.NEXTAUTH_SECRET || "bugiamap_super_secret_key_2026_mps_gov_vn";

  // LOG 1: Route being accessed
  console.log(`[MIDDLEWARE] Checking access for: ${pathname}`);

  // Lấy tất cả tên cookie hiện có để debug
  const allCookies = req.cookies.getAll().map(c => c.name);
  console.log(`[MIDDLEWARE] Available cookies: ${allCookies.join(', ')}`);

  // Thử lấy token với cấu hình mặc định (tự động nhận diện)
  let token = await getToken({ req, secret });

  // Nếu không thấy, thử ép buộc kiểm tra Secure Cookie (cho Vercel)
  if (!token && process.env.NODE_ENV === 'production') {
    console.log(`[MIDDLEWARE] Default getToken failed, retrying with secureCookie: true`);
    token = await getToken({ req, secret, secureCookie: true });
  }

  // Nếu vẫn không thấy, thử ép buộc kiểm tra Non-Secure Cookie (phòng trường hợp Vercel không dùng prefix)
  if (!token) {
    console.log(`[MIDDLEWARE] Secure getToken failed, retrying with secureCookie: false`);
    token = await getToken({ req, secret, secureCookie: false });
  }

  if (token) {
    console.log(`[MIDDLEWARE] SUCCESS: Token found for ${token.email}`);
  }
 else {
    // LOG 3: No token - Log cookies to see if they exist
    const cookieHeader = req.headers.get('cookie') || '';
    const hasSessionCookie = cookieHeader.includes('next-auth.session-token') || cookieHeader.includes('__Secure-next-auth.session-token');
    console.log(`[MIDDLEWARE] NO TOKEN FOUND! Has session cookie: ${hasSessionCookie}`);
    if (!hasSessionCookie) {
      console.log(`[MIDDLEWARE] All cookies: ${cookieHeader.substring(0, 100)}...`);
    }
  }

  const isAdminRoute = pathname.startsWith('/admin');
  const isOfficerRoute = pathname.startsWith('/officer');

  if (isAdminRoute || isOfficerRoute) {
    if (!token) {
      console.log(`[MIDDLEWARE] Redirecting to login from: ${pathname}`);
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
...

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
