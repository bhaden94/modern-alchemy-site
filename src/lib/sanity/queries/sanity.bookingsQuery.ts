import { groq } from 'next-sanity'
import { Observable } from 'rxjs'
import { SanityClient } from 'sanity'

import { Booking } from '~/schemas/models/booking'

export const bookingsQuery = groq`*[_type == "booking"] | order(_createdAt asc)`
export async function getBookings(client: SanityClient): Promise<Booking[]> {
  return await client.fetch(bookingsQuery, {}, { cache: 'no-store' })
}

export const bookingsByArtistIdQuery = groq`*[_type == "booking" && artist._ref == $artistId] | order(_createdAt asc)`
export async function getBookingsByArtistId(
  client: SanityClient,
  id: string,
): Promise<Booking[]> {
  const idParam = { artistId: id }
  return await client.fetch(bookingsByArtistIdQuery, idParam, {
    cache: 'no-store',
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
