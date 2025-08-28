import { updateSession } from '@/lib/db/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // Update session and get user data
    const { response, user, error } = await updateSession(request)
    
    // Check if user is authenticated (has valid user session)
    const isAuthenticated = !error && user && user.aud === 'authenticated'
    
    // Get current pathname
    const pathname = request.nextUrl.pathname
    
    // Skip authentication check for sign-in page (should not happen due to matcher, but safety net)
    if (pathname === '/sign-in') {
      return response
    }
    
    // If user is not authenticated, redirect to sign-in
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to sign-in')
      const signInUrl = new URL('/sign-in', request.url)
      return NextResponse.redirect(signInUrl)
    }
    
    return response
  } catch (err) {
    console.error('Middleware error:', err)
    // On error, redirect to sign-in to be safe
    const signInUrl = new URL('/sign-in', request.url)
    return NextResponse.redirect(signInUrl)
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sign-in|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}