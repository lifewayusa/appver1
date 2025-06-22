import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/blog(.*)',
  '/contato',
  '/destinos(.*)',
  '/quem-somos',
  '/termos',
  '/privacidade',
  '/planos',
  '/recursos-uteis',
  '/comparativo-cidades(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/start-journey(.*)',
  '/get-opportunity(.*)',
  '/visa-match(.*)',
  '/tools(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
