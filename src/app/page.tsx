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
  const layout = await getLayoutMetadata(client)
  const content = await performPageContentQuery('rootPageContent', client)

  return generateEnhancedMetadata({
    title: layout.businessName,
    description: layout.description || '',
    imageUrl: getImageFromRef(layout.openGraphImage)?.url,
    url: process.env.NEXT_PUBLIC_SITE_URL || '',
    siteName: layout.businessName,
    keywords: [
      ...(content?.keywords || []),
      layout.city || '',
      layout.state || '',
      layout.businessName,
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
