import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

import { REDIRECT_URL } from './lib/next-auth/auth.utils'
import { NavigationPages } from './utils/navigation'

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

    if (
      req.nextUrl.pathname === config.matcher[0] &&
      req.nextauth.token?.artistId
    ) {
      // route to settings page by default
      return NextResponse.redirect(
        new URL(
          `${req.nextUrl.pathname}/${encodeURIComponent(
            req.nextauth.token?.artistId,
          )}${NavigationPages.EmployeePortalSettings}`,
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
  matcher: [
    '/employee-portal',
    '/employee-portal/:id*',
  ],
}
