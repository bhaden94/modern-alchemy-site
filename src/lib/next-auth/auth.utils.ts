import { JWT } from 'next-auth/jwt'

import { readToken } from '../sanity/sanity.api'
import { getClient } from '../sanity/sanity.client'
import { getAllowedUsers } from '../sanity/sanity.queries'

export const REDIRECT_URL = 'redirectUrl'
export const AUTHORIZED_ROLE = 'authorizedUser'

export enum UserRoles {
  ADMIN,
}

export const checkIfAuthorized = async (token: JWT): Promise<boolean> => {
  const authClient = getClient(readToken)
  const allowedUsers = await getAllowedUsers(authClient)

  return allowedUsers.some((user) => user?.email === token?.email)
}
