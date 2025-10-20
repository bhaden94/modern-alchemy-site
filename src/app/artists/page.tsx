import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import Artists from '~/components/Artists/Artists'
import PageContainer from '~/components/PageContainer'
import PageInProgress from '~/components/PageInProgress/PageInProgress'
import { getActiveArtists } from '~/lib/sanity/queries/sanity.artistsQuery'
import {
  getLayoutMetadata,
  performPageContentQuery,
} from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'
import { generateEnhancedMetadata } from '~/utils/seo'

export async function generateMetadata(): Promise<Metadata> {
  const client = getClient(undefined)
  const content = await performPageContentQuery('artistsPageContent', client)
  const layout = await getLayoutMetadata(client)

  if (!content) return {}

  const locationParts = [layout.city, layout.state].filter(Boolean).join(', ')
  const enhancedDescription = locationParts
    ? `${content.metadataDescription || 'Meet our talented tattoo artists'} Located in ${locationParts}.`
    : content.metadataDescription || 'Meet our talented tattoo artists'

  return generateEnhancedMetadata({
    title: content.pageTitle,
    description: enhancedDescription,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/artists`,
    siteName: layout.businessName,
    keywords: [
      'tattoo artists',
      'professional tattoo artist',
      'custom tattoo designs',
      layout.city || '',
      layout.state || '',
      layout.businessName,
    ].filter(Boolean),
  })
}

const ArtistsShowcasePage = async () => {
  const client = getClient(undefined)
  const artistsData = getActiveArtists(client)
  const contentData = performPageContentQuery('artistsPageContent', client)

  const [artists, content] = await Promise.all([artistsData, contentData])

  if (!content) return notFound()

  if (!content.isActive) {
    return <PageInProgress />
  }

  return (
    <PageContainer>
      <Artists content={content} artists={artists} />
    </PageContainer>
  )
}

export default ArtistsShowcasePage
