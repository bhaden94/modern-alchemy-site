'use client'

import { useCallback, useEffect, useState } from 'react'

import BookingCard from '~/components/AdminBookingRequest/BookingCard/BookingCard'
import {
  getBookingsByArtistId,
  listenForBookingChanges,
} from '~/lib/sanity/queries/sanity.bookingsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { Artist } from '~/schemas/models/artist'
import { Booking } from '~/schemas/models/booking'

import CommandBar from './CommandBar/CommandBar'

interface IBookings {
  bookings: Booking[]
  artist: Artist
}

// Possibly needs simple pagination
// This is because it could cause weird things to happen if we have pagination for bookings
export default function AdminBookings({ bookings, artist }: IBookings) {
  const client = getClient(undefined)
  const [bookingsList, setBookingsList] = useState<Booking[]>(bookings)
  const [refreshDisabled, setRefreshDisabled] = useState(true)

  const refreshList = useCallback(() => {
    getBookingsByArtistId(client, artist._id).then(setBookingsList)
    setRefreshDisabled(true)
  }, [client, artist])

  useEffect(() => {
    const sub = listenForBookingChanges(client, artist._id).subscribe(
      (update) => {
        const deleteMutation = update.mutations.some((mutation: any) =>
          mutation.hasOwnProperty('delete'),
        )
        if (deleteMutation) {
          refreshList()
        } else {
          setRefreshDisabled(false)
        }
      },
    )

    return () => {
      sub.unsubscribe()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section>
      <div className="my-2">
        <CommandBar
          refreshDisabled={refreshDisabled}
          refreshList={refreshList}
        />
      </div>
      {bookingsList?.length ? (
        <>
          {bookingsList.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </>
      ) : undefined}
    </section>
  )
}
