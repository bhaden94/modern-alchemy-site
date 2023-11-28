import Container from '~/components/Container'
import { getClient } from '~/lib/sanity/sanity.client'
import { getBookings } from '~/lib/sanity/sanity.queries'

import Bookings from './bookings'

// TODO: generalize into an admin dashboard that shows artists requests for bookings
// TODO: come up with what the admin can do on this dashboard

export default async function BookingsPage() {
  const client = getClient(undefined)
  const bookings = await getBookings(client)

  return (
    <Container>
      <Bookings bookings={bookings} />
    </Container>
  )
}
