import { SchemaTypeDefinition } from 'sanity'

import allowedUser from './allowed-user'
import blockContent from './blockContent'
import booking from './booking'
import featureFlags from './feature-flags'
import post from './post'

// TODO: figure out how to generate types to use in code
export const schemaTypes = {
  post,
  blockContent,
  booking,
  allowedUser,
  featureFlags,
}
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, blockContent, booking, allowedUser, featureFlags],
}
