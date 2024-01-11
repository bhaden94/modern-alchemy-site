import AdminBooksStatus from '~/components/AdminBooksStatus/AdminBooksStatus'
import PageContainer from '~/components/PageContainer'
import PageTitle from '~/components/PageTitle/PageTitle'
import { getArtistById } from '~/lib/sanity/queries/sanity.artistsQuery'
import { getBookingsByArtistId } from '~/lib/sanity/queries/sanity.bookingsQuery'
import { getClient } from '~/lib/sanity/sanity.client'

import Bookings from '../bookings'

// TODO: generalize into an admin dashboard that shows artists requests for bookings
// TODO: come up with what the admin can do on this dashboard
const BookingsPage = async ({ params }: { params: { id: string } }) => {
  const client = getClient(undefined)
  const artist = await getArtistById(client, decodeURI(params.id))
  const bookings = await getBookingsByArtistId(client, artist._id)

  return (
    <PageContainer>
      <PageTitle title={`${artist.name} Booking Requests`} />
      <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
        <div className="order-2 md:order-1 md:col-span-4">
          <Bookings bookings={bookings} artistId={artist._id} />
        </div>
        <div className="order-1 md:order-2 md:col-span-2">
          <AdminBooksStatus
            booksStatus={{
              booksOpen: artist.booksOpen,
              booksOpenAt: artist.booksOpenAt,
              name: artist.name,
              _id: artist._id,
            }}
          />
        </div>
      </div>
    </PageContainer>
  )
}

export default BookingsPage
