import { redirect } from 'next/navigation'

import AdminBookings from '~/components/AdminBookingRequest/AdminBookings'
import PageContainer from '~/components/PageContainer'
import PageTitle from '~/components/PageTitle/PageTitle'
import { REDIRECT_URL } from '~/lib/next-auth/auth.utils'
import { getArtistById } from '~/lib/sanity/queries/sanity.artistsQuery'
import { getBookingsByArtistId } from '~/lib/sanity/queries/sanity.bookingsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { NavigationPages } from '~/utils/navigation'

const BookingsPage = async ({ params }: { params: { id: string } }) => {
  const client = getClient(undefined)
  const artist = await getArtistById(client, decodeURI(params.id))

  if (!artist) {
    redirect(
      `${NavigationPages.Unauthorized}?${REDIRECT_URL}=${encodeURIComponent(
        NavigationPages.EmployeePortal,
      )}`,
    )
  }

  const bookings = await getBookingsByArtistId(client, artist._id)

  return (
    <PageContainer>
      <PageTitle title={`${artist.name} Booking Requests`} />
      <AdminBookings bookings={bookings} artist={artist} />
    </PageContainer>
  )
}

export default BookingsPage
