import { groq } from 'next-sanity'
import { SanityClient } from 'sanity'

import { AftercareInfoPageContent } from '~/schemas/pages/aftercareInfoPageContent'
import { ArtistsPageContent } from '~/schemas/pages/artistsPageContent'
import { BookingInfoPageContent } from '~/schemas/pages/bookingInfoPageContent'
import { FaqPageContent } from '~/schemas/pages/faqPageContent'
import { LayoutMetadataContent } from '~/schemas/pages/layoutMetadataContent'
import { RootLayoutContent } from '~/schemas/pages/rootLayoutContent'
import { RootPageContent } from '~/schemas/pages/rootPageContent'

const rootPageContentQuery = groq`*[_type == "rootPageContent"][0]`
export async function getRootPageContent(
  client: SanityClient,
): Promise<RootPageContent> {
  return await client.fetch(
    rootPageContentQuery,
    {},
    {
      cache: 'no-cache',
    },
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
    {
      cache: 'no-cache',
    },
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
    {
      cache: 'no-cache',
    },
  )
}

const artistsPageContentQuery = groq`*[_type == "artistsPageContent"][0]`
export async function getArtistsPageContent(
  client: SanityClient,
): Promise<ArtistsPageContent> {
  return await client.fetch(
    artistsPageContentQuery,
    {},
    {
      cache: 'no-cache',
    },
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
    {
      cache: 'no-cache',
    },
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
    {
      cache: 'no-cache',
    },
  )
}

const layoutMetadataQuery = groq`*[_type == "layoutMetadataContent"][0]`
export async function getLayoutMetadata(
  client: SanityClient,
): Promise<LayoutMetadataContent> {
  return await client.fetch(
    layoutMetadataQuery,
    {},
    {
      cache: 'no-cache',
    },
  )
}
