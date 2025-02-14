// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// Danh sách các route admin
const ADMIN_ROUTES = [
  '/admin/:path*',
  '/admin/dashboard',
  '/admin/user',
  '/admin/settings',
  '/admin/product',
  '/admin/category',
  '/admin/attribute',
  '/admin/order',
  '/admin/order/:id',
];

export async function middleware(request: NextRequest) {
  // Lấy token từ request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log('token-->', token);  
  if (!token || token.accessTokenExpires === 0) {
    // response.cookies.delete('token');
    console.log('token hết hạn');
    return NextResponse.redirect(new URL('/', request.url));
  }
  // console.log('token-------->', token);
  const path = request.nextUrl.pathname;

  // Kiểm tra nếu đang truy cập vào route admin
  const isAdminRoute = ADMIN_ROUTES.some(route => path.startsWith(route));

  // console.log('isAdminRoute', isAdminRoute);
  // console.log('------->token', token);
  if (isAdminRoute) {
    // Kiểm tra token
    if (!token || !token.role) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Kiểm tra role admin
    const userRole = token.role as string;
    if (userRole !== 'admin') {
      // Không phải admin, chuyển đến trang unauthorized
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Kiểm tra token hết hạn
    // const currentTimestamp = Math.floor(Date.now() / 1000);
    // console.log('---------->currentTimestamp', currentTimestamp);
    if (!token.accessTokenExpires || token.accessTokenExpires === 0) {
      // response.cookies.delete('token');
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
