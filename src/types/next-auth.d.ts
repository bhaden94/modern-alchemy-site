import { DefaultJWT, JWT } from 'next-auth/jwt'

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    artistId?: string
    role: string | null
  }
}
