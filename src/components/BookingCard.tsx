'use client'

import Image from 'next/image'
import { useState } from 'react'

import { urlForImage } from '~/lib/sanity/sanity.image'
import { Booking } from '~/types/SanitySchemaTypes'
import { formatDate } from '~/utils'

interface IBookingCardProps {
  booking: Booking
}

export default function BookingCard({ booking }: IBookingCardProps) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const deleteBookingById = async () => {
    setIsDeleting(true)
    const response = await fetch('/api/sanity/booking', {
      method: 'DELETE',
      body: JSON.stringify({ id: booking._id }),
    })
    // TODO: handle error in response
    setIsDeleting(false)

    if (response.ok) {
      // trigger without awaiting so it does not hold up the UI
      fetch('/api/sanity/images', {
        method: 'DELETE',
        body: JSON.stringify({ imageReferences: booking.referenceImages }),
      })
    }
  }

  return (
    <div className="card">
      {booking.referenceImages[0] ? (
        <Image
          className="card__cover"
          src={urlForImage(booking.referenceImages[0])!
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
