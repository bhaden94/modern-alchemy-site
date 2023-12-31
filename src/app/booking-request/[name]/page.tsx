import BooksStatus from '~/components/BooksStatus/BooksStatus'
import PageContainer from '~/components/PageContainer'
import PageTitle from '~/components/PageTitle/PageTitle'
import TattooForm from '~/components/TattooForm'
import {
  getArtistByName,
  getArtists,
} from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'

export const generateStaticParams = async () => {
  const client = getClient(undefined)
  const artists = await getArtists(client)
  return artists.map((artist) => ({ name: artist.name }))
}

const ArtistBookingRequestPage = async ({
  params,
}: {
  params: { name: string }
}) => {
  const client = getClient(undefined)
  const artist = await getArtistByName(client, decodeURI(params.name))

  if (!artist) return <div>404</div>

  return (
    <PageContainer>
      <PageTitle title={`Booking with ${artist.name}`} />
      <BooksStatus name={artist.name} id={artist._id} showForm />
    </PageContainer>
  )
}

export default ArtistBookingRequestPage
