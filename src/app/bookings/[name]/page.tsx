import PageContainer from '~/components/Container'
import Features from '~/components/Features'
import { getArtistByName } from '~/lib/sanity/queries/sanity.artistsQuery'
import { getBookingsByArtistId } from '~/lib/sanity/queries/sanity.bookingsQuery'
import { getClient } from '~/lib/sanity/sanity.client'

import Bookings from '../bookings'

// TODO: generalize into an admin dashboard that shows artists requests for bookings
// TODO: come up with what the admin can do on this dashboard

const BookingsPage = async ({ params }: { params: { name: string } }) => {
  const client = getClient(undefined)
  const artist = await getArtistByName(client, decodeURI(params.name))
  const bookings = await getBookingsByArtistId(client, artist._id)

  return (
    <PageContainer>
      <Features />
      <Bookings bookings={bookings} artistId={artist._id} />
    </PageContainer>
  )
}

export default BookingsPage
