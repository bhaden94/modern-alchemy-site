import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

import { REDIRECT_URL } from './lib/next-auth/auth.utils'

export default withAuth(
  function middleware(req) {
    if (!req.nextauth.token?.role) {
      return NextResponse.redirect(
        new URL(
          `/unauthorized?${REDIRECT_URL}=${encodeURIComponent(
            req.nextUrl.pathname,
          )}`,
          req.url,
        ),
      )
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    secret: process.env.NEXTAUTH_SECRET,
  },
)

export const config = {
  matcher: '/bookings',
}
