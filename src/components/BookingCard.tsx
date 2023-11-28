'use client'

import Image from 'next/image'
import { useState } from 'react'

import { writeToken } from '~/lib/sanity/sanity.api'
import { getClient } from '~/lib/sanity/sanity.client'
import { urlForImage } from '~/lib/sanity/sanity.image'
import { type Booking, deleteBooking } from '~/lib/sanity/sanity.queries'
import { formatDate } from '~/utils'

interface IBookingCardProps {
  booking: Booking
  token: string
}

// TODO: move any logic related to getting the sanity client to an API route
// This is so we will have access to the sanity tokens on server side only
export default function BookingCard({ booking, token }: IBookingCardProps) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const deleteBookingById = async () => {
    setIsDeleting(true)
    const client = getClient(writeToken)
    await deleteBooking(client, booking._id)
    setIsDeleting(false)
  }

  return (
    <div className="card">
      {booking.showcaseImages[0] ? (
        <Image
          className="card__cover"
          src={urlForImage(booking.showcaseImages[0])!
            .width(500)
            .height(300)
            .url()}
          height={300}
          width={500}
          alt=""
        />
      ) : (
        <div className="card__cover--none" />
      )}
      <div className="card__container">
        <h3 className="card__title">{booking.name}</h3>
        <p className="card__excerpt">{booking.email}</p>
        <p className="card__date">{formatDate(booking._createdAt)}</p>
        <button onClick={() => deleteBookingById()} disabled={isDeleting}>
          Delete Booking
        </button>
      </div>
    </div>
  )
}
