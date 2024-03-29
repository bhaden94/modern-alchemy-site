import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ArtistPortfolio from '~/components/ArtistPortfolio/ArtistPortfolio'
import PageContainer from '~/components/PageContainer'
import {
  getArtistById,
  getArtists,
} from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { getImageFromRef } from '~/lib/sanity/sanity.image'

export const generateStaticParams = async () => {
  const client = getClient(undefined)
  const artists = await getArtists(client)
  return artists.map((artist) => ({ id: artist._id }))
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const client = getClient(undefined)
  const artist = await getArtistById(client, decodeURI(params.id))

  if (!artist) return {}

  const title = `${artist.name} Portfolio`
  const description = `Tattoo artist portfolio for ${artist.name}.`

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: getImageFromRef(artist.headshot)?.url,
    },
  }
}

const ArtistPortfolioPage = async ({ params }: { params: { id: string } }) => {
  const client = getClient(undefined)
  const artist = await getArtistById(client, decodeURI(params.id))

  if (!artist || !artist.isActive) return notFound()

  return (
    <PageContainer>
      <ArtistPortfolio artist={artist} />
    </PageContainer>
  )
}

export default ArtistPortfolioPage
