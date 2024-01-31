import { signOut } from 'next-auth/react'

import AdminBooksStatus from '~/components/AdminBooksStatus/AdminBooksStatus'
import PageContainer from '~/components/PageContainer'
import PageTitle from '~/components/PageTitle/PageTitle'
import { getArtistById } from '~/lib/sanity/queries/sanity.artistsQuery'
import { getBookingsByArtistId } from '~/lib/sanity/queries/sanity.bookingsQuery'
import { getClient } from '~/lib/sanity/sanity.client'

import Bookings from '../bookings'
import { NavigationPages } from '~/utils/navigation'
import { redirect } from 'next/navigation'
import { REDIRECT_URL } from '~/lib/next-auth/auth.utils'

// TODO: generalize into an admin dashboard that shows artists requests for bookings
// TODO: come up with what the admin can do on this dashboard
const BookingsPage = async ({ params }: { params: { id: string } }) => {
  const client = getClient(undefined)
  const artist = await getArtistById(client, decodeURI(params.id))

  if (!artist) {
    // signOut({ callbackUrl: NavigationPages.EmployeePortal })
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
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-8">
        <div className="order-2 md:order-1 md:col-span-4 lg:col-span-5 xl:col-span-6">
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
