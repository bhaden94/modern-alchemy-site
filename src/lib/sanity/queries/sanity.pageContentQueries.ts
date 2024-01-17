import { groq } from 'next-sanity'
import { SanityClient } from 'sanity'

import {
  AftercareInfoPageContent,
  ArtistsPageContent,
  BookingInfoPageContent,
  FaqPageContent,
  RootLayoutContent,
  RootPageContent,
} from '~/types/SanitySchemaTypes'

const revalidateRequests = 3600 // about every hour

const rootPageContentQuery = groq`*[_type == "rootPageContent"][0]`
export async function getRootPageContent(
  client: SanityClient,
): Promise<RootPageContent> {
  return await client.fetch(rootPageContentQuery, {
    next: { revalidate: revalidateRequests },
  })
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
  return await client.fetch(faqPageContentQuery, {
    next: { revalidate: revalidateRequests },
  })
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
  return await client.fetch(aftercareInfoPageContentQuery, {
    next: { revalidate: revalidateRequests },
  })
}

const artistsPageContentQuery = groq`*[_type == "artistsPageContent"][0]`
export async function getArtistsPageContent(
  client: SanityClient,
): Promise<ArtistsPageContent> {
  return await client.fetch(artistsPageContentQuery, {
    next: { revalidate: revalidateRequests },
  })
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
  return await client.fetch(bookingInfoPageContentQuery, {
    next: { revalidate: revalidateRequests },
  })
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
  return await client.fetch(rootLayoutContentQuery, {
    next: { revalidate: revalidateRequests },
  })
}
