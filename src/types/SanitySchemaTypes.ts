import type { PortableTextBlock } from '@portabletext/types'
import type { ImageAsset, Slug } from '@sanity/types'
import { TypedObject } from 'sanity'

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

type BasePageContent<T extends string> = {
  _type: T
  _id: string
  _createdAt: string
}

export interface Post extends BasePageContent<'post'> {
  title?: string
  slug: Slug
  excerpt?: string
  mainImage?: ImageAsset
  body: PortableTextBlock[]
}

export interface Booking extends BasePageContent<'booking'> {
  name: string
  phone_number: string
  email: string
  // characters: string
  description: string
  location: string
  style: string
  // prior_tattoo: string
  // preffered_day: string
  referenceImages: ImageAsset[]
  artist: any
}

export interface Artist extends BasePageContent<'artist'> {
  email: string
  name: string
  instagram: string
  booksOpen: boolean
  booksOpenAt: Date
  portfolioImages: ImageAsset[]
  role: Role
}

export interface FeatureFlag extends BasePageContent<'featureFlag'> {
  title: string
  key: string
  description?: string
  status: boolean
}

export interface RootPageContent extends BasePageContent<'rootPageContent'> {
  heroTitle: string
  heroDescription?: string
  homeContent?: string
}

interface Faq {
  question: string
  answer: TypedObject | TypedObject[]
}

export interface FaqPageContent extends BasePageContent<'faqPageContent'> {
  pageTitle: string
  faqs: Faq[]
}

export interface AftercareInfoPageContent
  extends BasePageContent<'aftercareInfoPageContent'> {
  pageTitle: string
  information: TypedObject | TypedObject[]
}
