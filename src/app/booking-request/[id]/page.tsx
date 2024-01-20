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

// TODO: Add artist form submission instructions to schema and on this page
// This way each artist can have their own instructions for the information they are looking for
const ArtistBookingRequestPage = async ({
  params,
}: {
  params: { id: string }
}) => {
  const client = getClient(undefined)
  const artist = await getArtistById(client, decodeURI(params.id))

  if (!artist) return notFound()

  return (
    <PageContainer>
      <PageTitle title={`Booking with ${artist.name}`} />
      <BookStatuses artists={[artist]} showForm />
    </PageContainer>
  )
}

export default ArtistBookingRequestPage
