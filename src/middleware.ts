import { updateSession } from '@/lib/db/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Update session and get user data
  const { response, user, error } = await updateSession(request)
  
  // Check if we're on a protected route
  const protectedRoutes = ['/dashboard', '/patients', '/schedule']
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  
  // Check if user is authenticated (has valid user session)
  const isAuthenticated = !error && user && user.aud === 'authenticated'
  
  if (isProtectedRoute) {
    if (!isAuthenticated) {
      // Redirect to sign-in if not authenticated
      const signInUrl = new URL('/sign-in', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }
  
  // If user is authenticated and tries to access sign-in, redirect to dashboard
  if (request.nextUrl.pathname === '/sign-in') {
    if (isAuthenticated) {
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}