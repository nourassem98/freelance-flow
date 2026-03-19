import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/pricing(.*)',
  '/sign-in(.*)',
  '/features(.*)',
  '/solution(.*)',
  '/about(.*)',
  '/privacy(.*)',
  '/terms(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    // Protect all routes except public ones
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|glb|gltf)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
