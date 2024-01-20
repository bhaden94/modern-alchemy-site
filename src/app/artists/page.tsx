import { notFound } from 'next/navigation'

import Artists from '~/components/Artists/Artists'
import PageContainer from '~/components/PageContainer'
import PageInProgress from '~/components/PageInProgress/PageInProgress'
import { getArtists } from '~/lib/sanity/queries/sanity.artistsQuery'
import { getArtistsPageContent } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'

const ArtistsShowcasePage = async () => {
  const client = getClient(undefined)
  const artistsData = getArtists(client)
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
