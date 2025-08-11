import { DefaultSession } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

import { AuthorizedRoles } from '~/lib/next-auth/auth.utils'

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    artistId?: string
    role: AuthorizedRoles | null
  }
}

declare module 'next-auth' {
  interface User {
    role?: AuthorizedRoles | null
  }

  interface Session extends DefaultSession {
    user: {
      role?: AuthorizedRoles | null
    } & DefaultSession['user']
  }
}
