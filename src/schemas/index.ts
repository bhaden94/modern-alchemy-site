import { SchemaTypeDefinition } from 'sanity'

import artist from './models/artist'
import blockContent from './models/blockContent'
import booking from './models/booking'
import featureFlags from './models/feature-flags'
import post from './models/post'
import aftercareInfoPageContent from './pages/aftercareInfoPageContent'
import artistsPageContent from './pages/artistsPageContent'
import bookingInfoPageContent from './pages/bookingInfoPageContent'
import faqPageContent from './pages/faqPageContent'
import rootLayoutContent from './pages/rootLayoutContent'
import rootPageContent from './pages/rootPageContent'
import layoutMetadataContent from './pages/layoutMetadataContent'

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
  rootLayoutContent,
  layoutMetadataContent,
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
    rootLayoutContent,
    layoutMetadataContent,
  ],
}

export type BaseSanitySchema<T extends string> = {
  _type: T
  _id: string
  _createdAt: string
}

export type BasePageContent = {
  pageTitle: string
  isActive: boolean
}
