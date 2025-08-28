import { updateSession } from '@/lib/db/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Enhanced logging for production debugging
  console.log(`[MIDDLEWARE] Processing: ${pathname} - URL: ${request.url}`)
  
  try {
    // Double-check: Skip sign-in route completely (safety net)
    if (pathname === '/sign-in') {
      console.log(`[MIDDLEWARE] Skipping sign-in route: ${pathname}`)
      return NextResponse.next()
    }
    
    // Update session and get user data
    const { response, user, error } = await updateSession(request)
    
    // Check if user is authenticated (has valid user session)
    const isAuthenticated = !error && user && user.aud === 'authenticated'
    
    console.log(`[MIDDLEWARE] Auth check for ${pathname}:`, {
      hasUser: !!user,
      userAud: user?.aud,
      hasError: !!error,
      isAuthenticated
    })
    
    // If user is not authenticated, redirect to sign-in
    if (!isAuthenticated) {
      console.log(`[MIDDLEWARE] Redirecting unauthenticated user from ${pathname} to /sign-in`)
      const signInUrl = new URL('/sign-in', request.url)
      return NextResponse.redirect(signInUrl)
    }
    
    console.log(`[MIDDLEWARE] Authenticated user accessing ${pathname}`)
    return response
  } catch (err) {
    console.error(`[MIDDLEWARE] Error processing ${pathname}:`, err)
    // On error, redirect to sign-in to be safe
    const signInUrl = new URL('/sign-in', request.url)
    return NextResponse.redirect(signInUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Include only specific protected routes:
     * - Root path /
     * - /patients
     * - /appointments
     * This completely excludes /sign-in, /api, and static files
     */
    '/',
    '/patients/:path*',
    '/appointments/:path*',
  ],
}