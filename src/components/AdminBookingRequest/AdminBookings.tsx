'use client'

import { useCallback, useEffect, useState } from 'react'

import BookingCard from '~/components/AdminBookingRequest/BookingCard/BookingCard'
import {
  getBookingsByArtistId,
  listenForBookingChanges,
} from '~/lib/sanity/queries/sanity.bookingsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { Booking } from '~/schemas/models/booking'

import CommandBar from './CommandBar/CommandBar'

interface IBookings {
  bookings: Booking[]
  artistId: string
}

// Possibly needs simple pagination
// This is because it could cause wierd things to happen if we have pagination for bookings
export default function AdminBookings({ bookings, artistId }: IBookings) {
  const client = getClient(undefined)
  const [bookingsList, setBookingsList] = useState<Booking[]>(bookings)
  const [refreshDisabled, setRefreshDisabled] = useState(true)

  const refreshList = useCallback(() => {
    getBookingsByArtistId(client, artistId).then(setBookingsList)
    setRefreshDisabled(true)
  }, [client, artistId])

  useEffect(() => {
    const sub = listenForBookingChanges(client, artistId).subscribe(
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
