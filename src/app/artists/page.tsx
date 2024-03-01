import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import Artists from '~/components/Artists/Artists'
import PageContainer from '~/components/PageContainer'
import PageInProgress from '~/components/PageInProgress/PageInProgress'
import { getActiveArtists } from '~/lib/sanity/queries/sanity.artistsQuery'
import { getArtistsPageContent } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'

export async function generateMetadata(): Promise<Metadata> {
  const client = getClient(undefined)
  const content = await getArtistsPageContent(client)
  if (!content) return {}

  return {
    title: content.pageTitle,
    description: content.metadataDescription,
    openGraph: {
      title: content.pageTitle,
      description: content.metadataDescription,
    },
  }
}

const ArtistsShowcasePage = async () => {
  const client = getClient(undefined)
  const artistsData = getActiveArtists(client)
  const contentData = getArtistsPageContent(client)

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
