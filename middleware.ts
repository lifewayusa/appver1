// Middleware temporariamente desabilitado para desenvolvimento
// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// const isPublicRoute = createRouteMatcher([
//   '/',
//   '/blog(.*)',
//   '/contato',
//   '/destinos(.*)',
//   '/quem-somos',
//   '/termos',
//   '/privacidade',
//   '/planos',
//   '/recursos-uteis',
//   '/comparativo-cidades(.*)',
//   '/sign-in(.*)',
//   '/sign-up(.*)',
// ]);

// const isProtectedRoute = createRouteMatcher([
//   '/dashboard(.*)',
//   '/start-journey(.*)',
//   '/get-opportunity(.*)',
//   '/visa-match(.*)',
//   '/tools(.*)',
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   if (isProtectedRoute(req)) {
//     await auth.protect();
//   }
// });

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
// };

// Middleware básico - sem proteção por enquanto
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
