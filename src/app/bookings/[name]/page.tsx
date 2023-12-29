import AdminBooksStatus from '~/components/AdminBooksStatus/AdminBooksStatus'
import PageContainer from '~/components/PageContainer'
import {
  getArtistBooksStatus,
  getArtistIdByName,
} from '~/lib/sanity/queries/sanity.artistsQuery'
import { getBookingsByArtistId } from '~/lib/sanity/queries/sanity.bookingsQuery'
import { getClient } from '~/lib/sanity/sanity.client'

import Bookings from '../bookings'

// TODO: generalize into an admin dashboard that shows artists requests for bookings
// TODO: come up with what the admin can do on this dashboard

const BookingsPage = async ({ params }: { params: { name: string } }) => {
  const client = getClient(undefined)
  const artist = await getArtistIdByName(client, decodeURI(params.name))
  const bookings = await getBookingsByArtistId(client, artist._id)
  const currBooksStatus = await getArtistBooksStatus(
    client,
    decodeURI(params.name),
  )

  return (
    <PageContainer>
      <AdminBooksStatus artistId={artist._id} booksStatus={currBooksStatus} />
      <Bookings bookings={bookings} artistId={artist._id} />
    </PageContainer>
  )
}

export default BookingsPage
