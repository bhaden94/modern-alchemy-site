import { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'

import { Artist, Role } from '~/types/SanitySchemaTypes'

import { getArtistByEmail } from '../sanity/queries/sanity.artistsQuery'
import { getClient } from '../sanity/sanity.client'

export const REDIRECT_URL = 'redirectUrl'
export const AUTHORIZED_ROLE = 'authorizedUser'

const getArtist = async (token: JWT): Promise<Artist | null> => {
  if (!token?.email) return null

  const authClient = getClient(undefined)
  const artist = await getArtistByEmail(authClient, token?.email)

  return artist
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
      // const isAuthorized = await checkIfAuthorized(token)
      const artist = await getArtist(token)

      token.role = artist?.role
      token.name = artist?.name

      return token
    },
  },
}
