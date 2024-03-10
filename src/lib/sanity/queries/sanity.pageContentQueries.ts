import { groq } from 'next-sanity'
import { SanityClient } from 'sanity'

import { AftercareInfoPageContent } from '~/schemas/pages/aftercareInfoPageContent'
import { ArtistsPageContent } from '~/schemas/pages/artistsPageContent'
import { BookingInfoPageContent } from '~/schemas/pages/bookingInfoPageContent'
import { FaqPageContent } from '~/schemas/pages/faqPageContent'
import { LayoutMetadataContent } from '~/schemas/pages/layoutMetadataContent'
import { PrivacyPolicyPageContent } from '~/schemas/pages/privacyPolicyPageContent'
import { RootLayoutContent } from '~/schemas/pages/rootLayoutContent'
import { RootPageContent } from '~/schemas/pages/rootPageContent'

import { SANITY_CLIENT_CACHE_SETTING } from '../sanity.client'
import { IMAGE_QUERY } from '../sanity.image'

// Spread base page content before rest of content
// This is so the _type field in basePageContent does not overwrite the documents
const buildGroqPageQuery = (type: string, additionalQuery?: string): string => {
  return groq`*[_type == "${type}"][0]{
    ...basePageContent,
    ...,
    ${additionalQuery}
  }`
}

const rootPageContentQuery = buildGroqPageQuery(
  'rootPageContent',
  `aboutContent[]{
    ...,
    image{
      ${IMAGE_QUERY}
    }
  }`,
)
export async function getRootPageContent(
  client: SanityClient,
): Promise<RootPageContent> {
  return await client.fetch(
    rootPageContentQuery,
    {},
    SANITY_CLIENT_CACHE_SETTING,
  )
}

// answer is the blockContent field, which is inside of the faqs array
const faqPageContentQuery = buildGroqPageQuery(
  'faqPageContent',
  `faqs[]{
    ...,
    answer[]{
      ${IMAGE_QUERY}
    }
  }`,
)
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
const aftercareInfoPageContentQuery = buildGroqPageQuery(
  'aftercareInfoPageContent',
  `information[]{
    ${IMAGE_QUERY}
  }`,
)
export async function getAftercareInfoPageContent(
  client: SanityClient,
): Promise<AftercareInfoPageContent> {
  return await client.fetch(
    aftercareInfoPageContentQuery,
    {},
    SANITY_CLIENT_CACHE_SETTING,
  )
}

const privacyPolicyPageContentQuery = buildGroqPageQuery(
  'privacyPolicyPageContent',
  `information[]{
    ${IMAGE_QUERY}
  }`,
)
export async function getPrivacyPolicyPageContent(
  client: SanityClient,
): Promise<PrivacyPolicyPageContent> {
  return await client.fetch(
    privacyPolicyPageContentQuery,
    {},
    SANITY_CLIENT_CACHE_SETTING,
  )
}

const artistsPageContentQuery = buildGroqPageQuery('artistsPageContent')
export async function getArtistsPageContent(
  client: SanityClient,
): Promise<ArtistsPageContent> {
  return await client.fetch(
    artistsPageContentQuery,
    {},
    SANITY_CLIENT_CACHE_SETTING,
  )
}

const bookingInfoPageContentQuery = buildGroqPageQuery(
  'bookingInfoPageContent',
  `information[]{
    ${IMAGE_QUERY}
  }`,
)
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
    ${IMAGE_QUERY}
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
    ${IMAGE_QUERY}
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
