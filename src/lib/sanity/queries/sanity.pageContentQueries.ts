import { groq } from 'next-sanity'
import { SanityClient } from 'sanity'

import { AftercareInfoPageContent } from '~/schemas/pages/aftercareInfoPageContent'
import { AnnouncementPageContent } from '~/schemas/pages/announcementPageContent'
import { ArtistsPageContent } from '~/schemas/pages/artistsPageContent'
import { BookingInfoPageContent } from '~/schemas/pages/bookingInfoPageContent'
import { DisclaimerPageContent } from '~/schemas/pages/disclaimerPageContent'
import { FaqPageContent } from '~/schemas/pages/faqPageContent'
import { LayoutMetadataContent } from '~/schemas/pages/layoutMetadataContent'
import { PrivacyPolicyPageContent } from '~/schemas/pages/privacyPolicyPageContent'
import { RootLayoutContent } from '~/schemas/pages/rootLayoutContent'
import { RootPageContent } from '~/schemas/pages/rootPageContent'

import { getClient } from '../sanity.client'

type QueryReturnType = {
  rootPageContent: RootPageContent
  faqPageContent: FaqPageContent
  aftercareInfoPageContent: AftercareInfoPageContent
  privacyPolicyPageContent: PrivacyPolicyPageContent
  artistsPageContent: ArtistsPageContent
  bookingInfoPageContent: BookingInfoPageContent
  disclaimerPageContent: DisclaimerPageContent
  announcementPageContent: AnnouncementPageContent
}

export async function performPageContentQuery<T extends keyof QueryReturnType>(
  param: T,
  sanityClient?: SanityClient,
  additionalQuery?: string,
): Promise<QueryReturnType[T]> {
  const client = sanityClient || getClient(undefined)
  // Spread base page content before rest of content
  // This is so the _type field in basePageContent does not overwrite the documents
  const query = groq`*[_type == "${param}"][0]{
    ...basePageContent,
    ...,
    ${additionalQuery}
  }`
  return await client.fetch(query, {}, { next: { tags: [`'${param}'`] } })
}

const rootLayoutContentQuery = groq`*[_type == "rootLayoutContent"][0]`
export async function getRootLayoutContent(
  client: SanityClient,
): Promise<RootLayoutContent> {
  return await client.fetch(
    rootLayoutContentQuery,
    {},
    { next: { tags: ['rootLayoutContent'] } },
  )
}

const layoutMetadataQuery = groq`*[_type == "layoutMetadataContent"][0]`
export async function getLayoutMetadata(
  client: SanityClient,
): Promise<LayoutMetadataContent> {
  return await client.fetch(
    layoutMetadataQuery,
    {},
    { next: { tags: ['layoutMetadataContent'] } },
  )
}
