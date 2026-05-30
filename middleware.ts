import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname === '/login';
  const token = request.cookies.get('amere-user');

  // Si está en login page y ya está autenticado, redirigir al home
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Si no está en login page y no está autenticado, redirigir al login
  if (!isAuthPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.png|logo-new.png).*)'],
};
