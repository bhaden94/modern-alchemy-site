import { groq } from 'next-sanity'
import { SanityClient } from 'sanity'

import { AllowedUser } from '~/types/SchemaTypes'

export const allowedUsersQuery = groq`*[_type == "allowedUser"]`
export async function getAllowedUsers(
  client: SanityClient,
): Promise<AllowedUser[]> {
  return await client.fetch(allowedUsersQuery)
}
