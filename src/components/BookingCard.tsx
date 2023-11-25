import Image from 'next/image'
import { useState } from 'react'
import { getClient } from '~/lib/sanity/sanity.client'

import { urlForImage } from '~/lib/sanity/sanity.image'
import { deleteBooking, type Booking } from '~/lib/sanity/sanity.queries'
import { formatDate } from '~/utils'

interface IBookingCardProps {
  booking: Booking
  token: string
}

export default function BookingCard({ booking, token }: IBookingCardProps) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const deleteBookingById = async () => {
    setIsDeleting(true)
    const client = getClient({ token: token })
    await deleteBooking(client, booking._id)
    setIsDeleting(false)
  }

  return (
    <div className="card">
      {booking.showcaseImages[0] ? (
        <Image
          className="card__cover"
          src={urlForImage(booking.showcaseImages[0])
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
