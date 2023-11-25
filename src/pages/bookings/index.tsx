import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import BookingCard from '~/components/BookingCard'
import Container from '~/components/Container'
import { writeToken } from '~/lib/sanity/sanity.api'
import { getClient } from '~/lib/sanity/sanity.client'
import {
  getBookings,
  type Booking,
  bookingsQuery,
} from '~/lib/sanity/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'

import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

// TODO: generalize into an admin dashboard that shows artists requests for bookings
// TODO: come up with what the admin can do on this dashboard
export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    bookings: Booking[]
  }
> = async ({ draftMode = false }) => {
  const authClient = getClient(draftMode ? { token: writeToken } : undefined)
  const bookings = await getBookings(authClient)

  return {
    props: {
      draftMode,
      token: writeToken,
      bookings,
    },
  }
}

export default function BookingsPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const client = getClient(undefined)
  const [bookings, setBookings] = useState<Booking[]>(props.bookings)

  useEffect(() => {
    const sub = client
      .listen(bookingsQuery, {}, { visibility: 'query' })
      .subscribe(() => {
        getBookings(client).then(setBookings)
      })

    return () => {
      sub.unsubscribe()
    }
  }, [])

  return (
    <Container>
      <section>
        {bookings.length ? (
          <>
            <button onClick={() => signOut({ callbackUrl: '/' })}>
              Sign Out
            </button>
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                token={props.token}
              />
            ))}
          </>
        ) : (
          <button onClick={() => signOut({ callbackUrl: '/' })}>
            Sign Out
          </button>
        )}
      </section>
    </Container>
  )
}
