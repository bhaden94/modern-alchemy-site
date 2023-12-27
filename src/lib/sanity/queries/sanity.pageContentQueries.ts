import { groq } from 'next-sanity'
import { SanityClient } from 'sanity'

import { FaqPageContent, RootPageContent } from '~/types/SanitySchemaTypes'

const rootPageContentQuery = groq`*[_type == "rootPageContent"][0]`
export async function getRootPageContent(
  client: SanityClient,
): Promise<RootPageContent> {
  return await client.fetch(rootPageContentQuery)
}

const faqPageContentQuery = groq`*[_type == "faqPageContent"][0]`
export async function getFaqPageContent(
  client: SanityClient,
): Promise<FaqPageContent> {
  return await client.fetch(faqPageContentQuery)
}
