import { updateSession } from '@/lib/db/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Update session and get user data
  const { response, user, error } = await updateSession(request)
  
  // Check if user is authenticated (has valid user session)
  const isAuthenticated = !error && user && user.aud === 'authenticated'
  
  // If user is not authenticated and not on sign-in page, redirect to sign-in
  if (!isAuthenticated && request.nextUrl.pathname !== '/sign-in') {
    const signInUrl = new URL('/sign-in', request.url)
    return NextResponse.redirect(signInUrl)
  }
  
  // If user is authenticated and tries to access sign-in, redirect to root
  if (request.nextUrl.pathname === '/sign-in' && isAuthenticated) {
    const rootUrl = new URL('/', request.url)
    return NextResponse.redirect(rootUrl)
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}