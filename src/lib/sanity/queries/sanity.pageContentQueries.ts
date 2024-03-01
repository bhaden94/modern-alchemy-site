import { groq, ResponseQueryOptions } from 'next-sanity'
import { SanityClient } from 'sanity'

import { AftercareInfoPageContent } from '~/schemas/pages/aftercareInfoPageContent'
import { ArtistsPageContent } from '~/schemas/pages/artistsPageContent'
import { BookingInfoPageContent } from '~/schemas/pages/bookingInfoPageContent'
import { FaqPageContent } from '~/schemas/pages/faqPageContent'
import { LayoutMetadataContent } from '~/schemas/pages/layoutMetadataContent'
import { RootLayoutContent } from '~/schemas/pages/rootLayoutContent'
import { RootPageContent } from '~/schemas/pages/rootPageContent'

import { SANITY_CLIENT_CACHE_SETTING } from '../sanity.client'

const rootPageContentQuery = groq`*[_type == "rootPageContent"][0]{
  ...,
  aboutContent[]{
    ...,
    image{
      ...,
      asset->
    }
  }
}`
export async function getRootPageContent(
  client: SanityClient,
): Promise<RootPageContent> {
  return await client.fetch(
    rootPageContentQuery,
    {},
    SANITY_CLIENT_CACHE_SETTING,
  )
}

// answer is the bloc content field, which is inside of the faqs array
const faqPageContentQuery = groq`*[_type == "faqPageContent"][0]{
  ...,
  faqs[]{
    ...,
    answer[]{
      ...,
      _type == "image" => {
        ...,
        asset->
      }
    }
  }
}`
export async function getFaqPageContent(
  client: SanityClient,
): Promise<FaqPageContent> {
  return await client.fetch(
    faqPageContentQuery,
    {},
    SANITY_CLIENT_CACHE_SETTING,
  )
}

// information is the block content field
// within that field, there can be images that we need to get the asset for
const aftercareInfoPageContentQuery = groq`*[_type == "aftercareInfoPageContent"][0]{
  ...,
  information[]{
    ...,
    _type == "image" => {
      ...,
      asset->
    }
  }
}`
export async function getAftercareInfoPageContent(
  client: SanityClient,
): Promise<AftercareInfoPageContent> {
  return await client.fetch(
    aftercareInfoPageContentQuery,
    {},
    SANITY_CLIENT_CACHE_SETTING,
  )
}

const artistsPageContentQuery = groq`*[_type == "artistsPageContent"][0]`
export async function getArtistsPageContent(
  client: SanityClient,
): Promise<ArtistsPageContent> {
  return await client.fetch(
    artistsPageContentQuery,
    {},
    SANITY_CLIENT_CACHE_SETTING,
  )
}

const bookingInfoPageContentQuery = groq`*[_type == "bookingInfoPageContent"][0]{
  ...,
  information[]{
    ...,
    _type == "image" => {
      ...,
      asset->
    }
  }
}`
export async function getBookingInfoPageContent(
  client: SanityClient,
): Promise<BookingInfoPageContent> {
  return await client.fetch(
    bookingInfoPageContentQuery,
    {},
    SANITY_CLIENT_CACHE_SETTING,
  )
}

const rootLayoutContentQuery = groq`*[_type == "rootLayoutContent"][0]{
  ...,
  businessLogo{
    ...,
    _type == "image" => {
      ...,
      asset->
    }
  }
}`
export async function getRootLayoutContent(
  client: SanityClient,
): Promise<RootLayoutContent> {
  return await client.fetch(
    rootLayoutContentQuery,
    {},
    SANITY_CLIENT_CACHE_SETTING,
  )
}

const layoutMetadataQuery = groq`*[_type == "layoutMetadataContent"][0]{
  ...,
  openGraphImage{
    ...,
    _type == "image" => {
      ...,
      asset->
    }
  }
}`
export async function getLayoutMetadata(
  client: SanityClient,
): Promise<LayoutMetadataContent> {
  return await client.fetch(
    layoutMetadataQuery,
    {},
    SANITY_CLIENT_CACHE_SETTING,
  )
}
