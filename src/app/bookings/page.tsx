import PageContainer from '~/components/Container'
import Features from '~/components/Features'
import { getBookings } from '~/lib/sanity/queries/sanity.bookingsQuery'
import { getClient } from '~/lib/sanity/sanity.client'

import Bookings from './bookings'

// TODO: generalize into an admin dashboard that shows artists requests for bookings
// TODO: come up with what the admin can do on this dashboard

export default async function BookingsPage() {
  const client = getClient(undefined)
  const bookings = await getBookings(client)

  return (
    <PageContainer>
      <Features />
      <Bookings bookings={bookings} />
    </PageContainer>
  )
}
