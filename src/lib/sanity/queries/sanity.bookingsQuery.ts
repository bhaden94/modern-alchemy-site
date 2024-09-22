import { groq } from 'next-sanity'
import { Observable } from 'rxjs'
import { SanityClient } from 'sanity'

import { Booking } from '~/schemas/models/booking'

import { NEXT_TAGS_CONFIG } from '../sanity.client'

export const bookingsByArtistIdQuery = groq`*[_type == "booking" && artist._ref == $artistId] | order(_createdAt asc)`
export async function getBookingsByArtistId(
  client: SanityClient,
  id: string,
): Promise<Booking[]> {
  const idParam = { artistId: id }
  return await client.fetch(
    bookingsByArtistIdQuery,
    idParam,
    NEXT_TAGS_CONFIG.BOOKING,
  )
}

export function listenForBookingChanges(
  client: SanityClient,
  id: string,
): Observable<Record<string, any>> {
  const idParam = { artistId: id }
  return client.listen(bookingsByArtistIdQuery, idParam, {
    visibility: 'query',
  })
}
