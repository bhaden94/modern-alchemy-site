'use client'

import { Button } from '@mantine/core'
import { signOut } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'

import BookingCard from '~/components/BookingCard/BookingCard'
import {
  getBookingsByArtistId,
  listenForBookingChanges,
} from '~/lib/sanity/queries/sanity.bookingsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { Booking } from '~/types/SanitySchemaTypes'
import { NavigationPages } from '~/utils/navigation'

interface IBookings {
  bookings: Booking[]
  artistId: string
}

// TODO: simple pagination
// This is because it could cause wierd things to happen if we have pagination for bookings
export default function Bookings({ bookings, artistId }: IBookings) {
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
        <Button disabled={refreshDisabled} onClick={refreshList}>
          Refresh list
        </Button>
        <Button
          className="float-right"
          variant="outline"
          onClick={() => signOut({ callbackUrl: NavigationPages.Home })}
        >
          Sign Out
        </Button>
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
