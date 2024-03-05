import { NextRequest, NextResponse } from 'next/server'
import { NextAuthOptions, Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'

import { Artist } from '~/schemas/models/artist'

import { getArtistByEmail } from '../sanity/queries/sanity.artistsQuery'
import { getClient } from '../sanity/sanity.client'

export const REDIRECT_URL = 'redirectUrl'
export const AUTHORIZED_ROLE = 'authorizedArtist'

const getArtist = async (token: JWT): Promise<Partial<Artist> | null> => {
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
      const artist = await getArtist(token)

      token.role = artist ? AUTHORIZED_ROLE : null
      token.name = artist?.name
      token.artistId = artist?._id

      return token
    },
  },
}

export const notAuthorizedResponse = (request: NextRequest): NextResponse => {
  console.warn(
    `An unauthorized request was received on route ${request.nextUrl}.`,
  )
  console.warn('Request headers: ', request.headers)
  console.warn('Request IP:', request.ip)
  return new NextResponse(`Unauthorized`, {
    status: 401,
    statusText: JSON.stringify('You are not authorized to make this request.'),
  })
}

export const logAuthorizedRequest = (
  session: Session,
  request: NextRequest,
) => {
  console.log(
    `${session.user?.name} - ${session.user?.email} requested a ${request.method} operation on ${request.nextUrl}.`,
  )
}
