import { JWT } from 'next-auth/jwt'
import { getClient } from '../sanity/sanity.client'
import { getAllowedUsers } from '../sanity/sanity.queries'
import { readToken } from '../sanity/sanity.api'

export const REDIRECT_URL = 'redirectUrl'
export const AUTHORIZED_ROLE = 'authorizedUser'

export enum UserRoles {
  ADMIN,
}

export const checkIfAuthorized = async (token: JWT): Promise<boolean> => {
  const authClient = getClient({ token: readToken })
  const allowedUsers = await getAllowedUsers(authClient)

  return allowedUsers.some((user) => user?.email === token?.email)
}
