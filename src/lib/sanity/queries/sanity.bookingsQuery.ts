import { groq, SanityClient } from 'next-sanity'
import { Observable } from 'rxjs'

import { Booking } from '~/schemas/models/booking'
import { GenericBooking } from '~/schemas/models/genericBooking'

import { NEXT_CACHE_CONFIG } from '../sanity.client'

export const bookingsByArtistIdQuery = groq`*[_type in ['booking', 'genericBooking'] && artist._ref == $artistId] | order(_createdAt asc)`
export async function getBookingsByArtistId(
  client: SanityClient,
  id: string,
): Promise<(Booking | GenericBooking)[]> {
  const idParam = {
    artistId: id,
  }
  return await client.fetch(
    bookingsByArtistIdQuery,
    idParam,
    NEXT_CACHE_CONFIG.BOOKING,
  )
}

export function listenForBookingChanges(
  client: SanityClient,
  id: string,
): Observable<Record<string, any>> {
  const idParam = {
    artistId: id,
  }
  return client.listen(bookingsByArtistIdQuery, idParam, {
    visibility: 'query',
  })
}
