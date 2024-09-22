import { groq } from 'next-sanity'
import { Observable } from 'rxjs'
import { SanityClient } from 'sanity'

import { Booking } from '~/schemas/models/booking'

export const bookingsByArtistIdQuery = groq`*[_type == "booking" && artist._ref == $artistId] | order(_createdAt asc)`
export async function getBookingsByArtistId(
  client: SanityClient,
  id: string,
): Promise<Booking[]> {
  const idParam = { artistId: id }
  return await client.fetch(bookingsByArtistIdQuery, idParam, {
    next: { tags: ['booking'] },
  })
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
