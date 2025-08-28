import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Check for required environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables')
    return { response, user: null, error: new Error('Missing Supabase configuration') }
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Add debugging for production
    if (process.env.NODE_ENV === 'production') {
      console.log('Auth check:', { 
        hasUser: !!user, 
        userAud: user?.aud,
        hasError: !!error,
        pathname: request.nextUrl.pathname 
      })
    }
    
    return { response, user, error }
  } catch (error) {
    console.error('Supabase auth error:', error)
    return { response, user: null, error }
  }
}