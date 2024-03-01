import { SchemaTypeDefinition } from 'sanity'

import artist from './models/artist'
import blockContent from './models/blockContent'
import booking from './models/booking'
import aftercareInfoPageContent from './pages/aftercareInfoPageContent'
import artistsPageContent from './pages/artistsPageContent'
import bookingInfoPageContent from './pages/bookingInfoPageContent'
import faqPageContent from './pages/faqPageContent'
import layoutMetadataContent from './pages/layoutMetadataContent'
import rootLayoutContent from './pages/rootLayoutContent'
import rootPageContent from './pages/rootPageContent'

export const schemaTypes = {
  blockContent,
  booking,
  artist,
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
    // Layout/Metadata
    layoutMetadataContent,
    rootLayoutContent,
    // Pages
    rootPageContent,
    artistsPageContent,
    aftercareInfoPageContent,
    faqPageContent,
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

export type BasePageContent = {
  pageTitle: string
  isActive: boolean
  metadataDescription?: string
}
