import { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'

import { getClient } from '../sanity/sanity.client'
import { getAllowedUsers } from '../sanity/sanity.queries'

export const REDIRECT_URL = 'redirectUrl'
export const AUTHORIZED_ROLE = 'authorizedUser'

export enum UserRoles {
  ADMIN,
}

export const checkIfAuthorized = async (token: JWT): Promise<boolean> => {
  const authClient = getClient(undefined)
  const allowedUsers = await getAllowedUsers(authClient)

  return allowedUsers.some((user) => user?.email === token?.email)
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_ID || '',
      clientSecret: process.env.GOOGLE_AUTH_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token }) {
      const isAuthorized = await checkIfAuthorized(token)

      if (isAuthorized) {
        token.role = UserRoles.ADMIN
      }

      return token
    },
  },
}
