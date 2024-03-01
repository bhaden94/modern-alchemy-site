import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import BookStatuses from '~/components/BooksStatus/BookStatuses'
import PageContainer from '~/components/PageContainer'
import PageTitle from '~/components/PageTitle/PageTitle'
import {
  getArtistById,
  getArtists,
} from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'

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

  const title = `${artist.name} Booking Request`
  const description = `Submit a tattoo appointment booking request to ${artist.name}.`

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: artist.headshot?.asset.url,
    },
  }
}

const ArtistBookingRequestPage = async ({
  params,
}: {
  params: { id: string }
}) => {
  const client = getClient(undefined)
  const artist = await getArtistById(client, decodeURI(params.id))

  if (!artist || !artist.isActive) return notFound()

  return (
    <PageContainer>
      <PageTitle title={`Booking with ${artist.name}`} />
      <BookStatuses artists={[artist]} showForm />
    </PageContainer>
  )
}

export default ArtistBookingRequestPage
