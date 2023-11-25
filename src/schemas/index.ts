import { SchemaTypeDefinition } from 'sanity'

import blockContent from './blockContent'
import post from './post'
import booking from './booking'
import allowedUser from './allowed-user'
import featureFlags from './feature-flags'

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
