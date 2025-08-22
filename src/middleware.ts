import { updateSession } from '@/lib/db/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Update session first
  const response = await updateSession(request)
  
  // Check if we're on a protected route
  const protectedRoutes = ['/dashboard', '/patients', '/schedule']
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  
  if (isProtectedRoute) {
    // Check if user is authenticated by looking for auth tokens in cookies
    const authToken = request.cookies.get('sb-127001-auth-token')
    
    if (!authToken) {
      // Redirect to sign-in if not authenticated
      const signInUrl = new URL('/sign-in', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }
  
  // If user is authenticated and tries to access sign-in, redirect to dashboard
  if (request.nextUrl.pathname === '/sign-in') {
    const authToken = request.cookies.get('sb-127001-auth-token')
    
    if (authToken) {
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