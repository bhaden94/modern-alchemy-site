import { SchemaTypeDefinition } from 'sanity'

import artist from './models/artist'
import blockContent from './models/blockContent'
import booking from './models/booking'
import genericBooking from './models/genericBooking'
import mailingList from './models/mailingList'
import aftercareInfoPageContent from './pages/aftercareInfoPageContent'
import announcementPageContent from './pages/announcementPageContent'
import artistsPageContent from './pages/artistsPageContent'
import basePageContent from './pages/basePageContent'
import bookingInfoPageContent from './pages/bookingInfoPageContent'
import disclaimerPageContent from './pages/disclaimerPageContent'
import employmentPageContent from './pages/employmentPageContent'
import faqPageContent from './pages/faqPageContent'
import layoutMetadataContent from './pages/layoutMetadataContent'
import privacyPolicyPageContent from './pages/privacyPolicyPageContent'
import rootLayoutContent from './pages/rootLayoutContent'
import rootPageContent from './pages/rootPageContent'

export const schemaTypes = {
  blockContent,
  booking,
  genericBooking,
  artist,
  mailingList,
  basePageContent,
  rootPageContent,
  faqPageContent,
  privacyPolicyPageContent,
  disclaimerPageContent,
  aftercareInfoPageContent,
  artistsPageContent,
  bookingInfoPageContent,
  announcementPageContent,
  employmentPageContent,
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
    announcementPageContent,
    employmentPageContent,
    // Models
    artist,
    booking,
    genericBooking,
    mailingList,
    // Objects
    blockContent,
  ],
}

export type BaseSanitySchema<T extends string> = {
  _type: T
  _id: string
  _createdAt: string
}
