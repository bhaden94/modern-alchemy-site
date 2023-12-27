import { SchemaTypeDefinition } from 'sanity'

import artist from './artist'
import blockContent from './blockContent'
import booking from './booking'
import faqPageContent from './faqPageContent'
import featureFlags from './feature-flags'
import post from './post'
import rootPageContent from './rootPageContent'

// TODO: figure out how to generate types to use in code
export const schemaTypes = {
  post,
  blockContent,
  booking,
  artist,
  featureFlags,
  rootPageContent,
  faqPageContent,
}
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    post,
    blockContent,
    booking,
    artist,
    featureFlags,
    rootPageContent,
    faqPageContent,
  ],
}
