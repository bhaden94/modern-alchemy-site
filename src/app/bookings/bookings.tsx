'use client'

import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

import BookingCard from '~/components/BookingCard'
import {
  bookingsQuery,
  getBookings,
} from '~/lib/sanity/queries/sanity.bookingsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { Booking } from '~/types/SchemaTypes'

interface IBookings {
  bookings: Booking[]
}

export default function Bookings({ bookings }: IBookings) {
  const client = getClient(undefined)
  const [bookingsList, setBookingsList] = useState<Booking[]>(bookings)

  useEffect(() => {
    const sub = client
      .listen(bookingsQuery, {}, { visibility: 'query' })
      .subscribe(() => {
        getBookings(client).then(setBookingsList)
      })

    return () => {
      sub.unsubscribe()
    }
  }, [client])

  return (
    <section>
      {bookingsList?.length ? (
        <>
          <button onClick={() => signOut({ callbackUrl: '/' })}>
            Sign Out
          </button>
          {bookingsList.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </>
      ) : (
        <button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button>
      )}
    </section>
  )
}
