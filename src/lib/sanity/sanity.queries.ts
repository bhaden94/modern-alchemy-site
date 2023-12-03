import type { PortableTextBlock } from '@portabletext/types'
import { SanityClient } from '@sanity/client'
import type { ImageAsset, Slug } from '@sanity/types'
import groq from 'groq'
import { Observable } from 'rxjs'

// TODO: split out queries into specific folders
const featureFlagParams = { flagType: 'featureFlag' }
const featureFlagsQuery = groq`*[_type == $flagType]`
const featureFlagQueryByKey = groq`*[_type == $flagType && key == $key][0]`
export async function getFeatureFlags(
  client: SanityClient,
): Promise<FeatureFlag[]> {
  return await client.fetch(featureFlagsQuery, featureFlagParams)
}
export async function getSingleFeatureFlag(
  client: SanityClient,
  key: string,
): Promise<FeatureFlag> {
  featureFlagParams['key'] = key
  return await client.fetch(featureFlagQueryByKey, featureFlagParams)
}
// TODO: updating next-sanity broke the listen function
export function listenForFeatureFlagChanges(
  client: SanityClient,
): Observable<Record<string, any>> {
  return client.listen(featureFlagsQuery, featureFlagParams)
}

export const allowedUsersQuery = groq`*[_type == "allowedUser"]`
export async function getAllowedUsers(
  client: SanityClient,
): Promise<AllowedUser[]> {
  return await client.fetch(allowedUsersQuery)
}

export const bookingsQuery = groq`*[_type == "booking"] | order(_createdAt asc)`
export async function getBookings(client: SanityClient): Promise<Booking[]> {
  return await client.fetch(bookingsQuery, {}, { cache: 'no-store' })
}

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`
export async function getPosts(client: SanityClient): Promise<Post[]> {
  return await client.fetch(postsQuery)
}

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]`

export async function getPost(
  client: SanityClient,
  slug: string,
): Promise<Post> {
  return await client.fetch(postBySlugQuery, {
    slug,
  })
}

export async function deletePost(
  client: SanityClient,
  id: string,
): Promise<any> {
  return await client.delete(id)
}

export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`

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
  characters: string
  description: string
  location: string
  style: string
  prior_tattoo: string
  preffered_day: string
  showcaseImages: ImageAsset[]
}

export interface AllowedUser {
  _type: 'allowedUser'
  _id: string
  _createdAt: string
  email: string
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
