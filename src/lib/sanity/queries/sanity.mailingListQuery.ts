import { groq, SanityClient } from 'next-sanity'

import { MailingListContent } from '~/schemas/models/mailingList'

import { getClient, NEXT_CACHE_CONFIG } from '../sanity.client'

// The first mailing list document is assumed to be the default one until we add artist references
export const mailingListQuery = groq`*[_type == "mailingList"] | order(_createdAt asc)[0]`
export async function getDefaultMailingList(
  sanityClient?: SanityClient,
): Promise<MailingListContent | undefined> {
  const client = sanityClient || getClient(undefined)

  return await client.fetch(
    mailingListQuery,
    {},
    NEXT_CACHE_CONFIG.MAILING_LIST,
  )
}
