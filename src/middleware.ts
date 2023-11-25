import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { REDIRECT_URL, UserRoles } from './lib/next-auth/auth.utils'

export default withAuth(
  function middleware(req) {
    if (req.nextauth.token?.role !== UserRoles.ADMIN) {
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
