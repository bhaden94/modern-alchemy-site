import { groq } from 'next-sanity'
import { SanityClient } from 'sanity'

import { Booking } from '~/types/SchemaTypes'

export const bookingsQuery = groq`*[_type == "booking"] | order(_createdAt asc)`
export async function getBookings(client: SanityClient): Promise<Booking[]> {
  return await client.fetch(bookingsQuery, {}, { cache: 'no-store' })
}
