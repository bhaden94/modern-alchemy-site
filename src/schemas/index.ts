import { SchemaTypeDefinition } from 'sanity'

import artist from './models/artist'
import blockContent from './models/blockContent'
import booking from './models/booking'
import aftercareInfoPageContent from './pages/aftercareInfoPageContent'
import artistsPageContent from './pages/artistsPageContent'
import basePageContent from './pages/basePageContent'
import bookingInfoPageContent from './pages/bookingInfoPageContent'
import disclaimerPageContent from './pages/disclaimerPageContent'
import faqPageContent from './pages/faqPageContent'
import layoutMetadataContent from './pages/layoutMetadataContent'
import privacyPolicyPageContent from './pages/privacyPolicyPageContent'
import rootLayoutContent from './pages/rootLayoutContent'
import rootPageContent from './pages/rootPageContent'

export const schemaTypes = {
  blockContent,
  booking,
  artist,
  basePageContent,
  rootPageContent,
  faqPageContent,
  privacyPolicyPageContent,
  disclaimerPageContent,
  aftercareInfoPageContent,
  artistsPageContent,
  bookingInfoPageContent,
  rootLayoutContent,
  layoutMetadataContent,
}
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Layout/Metadata
    layoutMetadataContent,
    rootLayoutContent,
    // Pages
    basePageContent,
    rootPageContent,
    artistsPageContent,
    aftercareInfoPageContent,
    faqPageContent,
    privacyPolicyPageContent,
    disclaimerPageContent,
    bookingInfoPageContent,
    // Models
    artist,
    booking,
    // Objects
    blockContent,
  ],
}

export type BaseSanitySchema<T extends string> = {
  _type: T
  _id: string
  _createdAt: string
}
