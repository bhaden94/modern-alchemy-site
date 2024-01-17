import type { PortableTextBlock } from '@portabletext/types'
import type { ImageAsset, Slug } from '@sanity/types'
import { TypedObject } from 'sanity'

type BaseSanitySchema<T extends string> = {
  _type: T
  _id: string
  _createdAt: string
}

type BasePageContent = {
  pageTitle: string
}

interface Faq {
  question: string
  answer: TypedObject | TypedObject[]
}

/** Sanity Documents */
export enum Role {
  OWNER = 'owner',
  EMPLOYEE = 'employee',
}

export interface BlockContentImage {
  _type: 'image'
  _key: string
  altText: string
  asset: ImageAsset
}

export interface Post extends BaseSanitySchema<'post'> {
  title?: string
  slug: Slug
  excerpt?: string
  mainImage?: ImageAsset
  body: PortableTextBlock[]
}

export interface Booking extends BaseSanitySchema<'booking'> {
  name: string
  phoneNumber: string
  email: string
  // characters: string
  description: string
  location: string
  style: 'color' | 'black_and_grey'
  // prior_tattoo: string
  // preffered_day: string
  referenceImages: { asset: ImageAsset }[]
  artist: any
}

export interface Artist extends BaseSanitySchema<'artist'> {
  email: string
  name: string
  instagram: string
  booksOpen: boolean
  booksOpenAt: Date
  headshot: { asset: ImageAsset }
  styles: string[]
  portfolioImages: { asset: ImageAsset }[]
  role: Role
}

export interface FeatureFlag extends BaseSanitySchema<'featureFlag'> {
  title: string
  key: string
  description?: string
  status: boolean
}

/** Pages */
export interface RootPageContent
  extends BaseSanitySchema<'rootPageContent'>,
    BasePageContent {
  heroDescription?: string
  heroButtonText?: string
  heroButtonLink?: string
  homeContent?: string
}

export interface FaqPageContent
  extends BaseSanitySchema<'faqPageContent'>,
    BasePageContent {
  faqs: Faq[]
}

export interface AftercareInfoPageContent
  extends BaseSanitySchema<'aftercareInfoPageContent'>,
    BasePageContent {
  information: TypedObject | TypedObject[]
}

export interface ArtistsPageContent
  extends BaseSanitySchema<'artistsPageContent'>,
    BasePageContent {}

export interface BookingInfoPageContent
  extends BaseSanitySchema<'bookingInfoPageContent'>,
    BasePageContent {
  information: TypedObject | TypedObject[]
}

export interface RootLayoutContent
  extends BaseSanitySchema<'rootLayoutContent'> {
  businessLogo: { asset: ImageAsset }
  copywriteText: string
  businessLogoCaption?: string
  intagramLink?: string
  facebookLink?: string
}
