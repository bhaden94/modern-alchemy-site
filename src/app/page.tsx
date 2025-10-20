import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import About from '~/components/About/About'
import Hero from '~/components/Hero/Hero'
import { getDefaultMailingList } from '~/lib/sanity/queries/sanity.mailingListQuery'
import {
  getLayoutMetadata,
  performPageContentQuery,
} from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'
import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { generateEnhancedMetadata } from '~/utils/seo'

export async function generateMetadata(): Promise<Metadata> {
  const client = getClient(undefined)
  const metadata = await getLayoutMetadata(client)
  const content = await performPageContentQuery('rootPageContent', client)

  if (!metadata) return {}

  const title = metadata.businessName
  const locationParts = [metadata.city, metadata.state]
    .filter(Boolean)
    .join(', ')
  const description = content?.heroDescription
    ? `${content.heroDescription} Located in ${locationParts}.`
    : metadata.description ||
      `${metadata.businessName} - Professional tattoo studio in ${metadata.location}`

  return generateEnhancedMetadata({
    title,
    description,
    imageUrl: getImageFromRef(metadata.openGraphImage)?.url,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: metadata.businessName,
    keywords: [
      'tattoo studio',
      'professional tattoo artist',
      'custom tattoos',
      'tattoo shop',
      metadata.city || '',
      metadata.state || '',
      metadata.businessName,
      'tattoo near me',
    ].filter(Boolean),
  })
}

export default async function RootPage() {
  const client = getClient(undefined)
  const content = await performPageContentQuery('rootPageContent', client)
  // When we have an artist specific mailing list, we should still get the default here
  const mailingListContent = await getDefaultMailingList(client)

  if (!content) return notFound()

  return (
    <>
      <Hero
        title={content.pageTitle}
        description={content.heroDescription}
        buttonText={content.heroButtonText}
        buttonLink={content.heroButtonLink}
        mailingListContent={mailingListContent}
      />
      <About
        aboutContent={content.aboutContent}
        mailingListContent={mailingListContent}
      />
    </>
  )
}
