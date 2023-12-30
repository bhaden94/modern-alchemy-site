import { SchemaTypeDefinition } from 'sanity'

import aftercareInfoPageContent from './aftercareInfoPageContent'
import artist from './artist'
import artistsPageContent from './artistsPageContent'
import blockContent from './blockContent'
import booking from './booking'
import bookingInfoPageContent from './bookingInfoPageContent'
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
  aftercareInfoPageContent,
  artistsPageContent,
  bookingInfoPageContent,
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
    aftercareInfoPageContent,
    artistsPageContent,
    bookingInfoPageContent,
  ],
}
