import type { PortableTextBlock } from '@portabletext/types'
import type { ImageAsset, Slug } from '@sanity/types'

export enum Role {
  OWNER = 'owner',
  EMPLOYEE = 'employee',
}

export interface Post {
  _type: 'post'
  _id: string
  _createdAt: string
  title?: string
  slug: Slug
  excerpt?: string
  mainImage?: ImageAsset
  body: PortableTextBlock[]
}

export interface Booking {
  _type: 'booking'
  _id: string
  _createdAt: string
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

export interface Artist {
  _type: 'artist'
  _id: string
  _createdAt: string
  email: string
  name: string
  instagram: string
  booksOpen: boolean
  booksOpenAt: Date
  portfolioImages: ImageAsset[]
  role: Role
}

export interface FeatureFlag {
  _type: 'featureFlag'
  _id: string
  _createdAt: string
  title: string
  key: string
  description?: string
  status: boolean
}
