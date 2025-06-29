import { DateValue } from '@mantine/dates'
import { groq } from 'next-sanity'
import { SanityClient } from 'next-sanity'
import { Observable } from 'rxjs'

import { Artist } from '~/schemas/models/artist'

import { NEXT_CACHE_CONFIG } from '../sanity.client'

const artistsQuery = groq`*[_type == "artist"]`
export async function getArtists(client: SanityClient): Promise<Artist[]> {
  return await client.fetch(artistsQuery, {}, NEXT_CACHE_CONFIG.ARTIST)
}

const activeArtistsQuery = groq`*[_type == "artist" && isActive]`
export async function getActiveArtists(
  client: SanityClient,
): Promise<Artist[]> {
  return await client.fetch(activeArtistsQuery, {}, NEXT_CACHE_CONFIG.ARTIST)
}

const artistsEmailQuery = groq`*[_type == "artist" && email == $email][0]{name, _id}`
export async function getArtistByEmail(
  client: SanityClient,
  email: string,
): Promise<Partial<Artist>> {
  const emailParam = { email: email.toLowerCase() }
  return await client.fetch(
    artistsEmailQuery,
    emailParam,
    NEXT_CACHE_CONFIG.ARTIST,
  )
}

const artistsIdQuery = groq`*[_type == "artist" && _id == $id][0]`
export async function getArtistById(
  client: SanityClient,
  id: string,
): Promise<Artist> {
  const idParam = { id: id }
  return await client.fetch(artistsIdQuery, idParam, NEXT_CACHE_CONFIG.ARTIST)
}

export interface BooksStatus {
  booksOpen: boolean
  booksOpenAt?: DateValue | null
  name: string
  _id: string
}

const artistsBooksStatusChangesById = groq`*[_type == "artist" && _id == $id][0]{booksOpen, booksOpenAt, name, _id}`
export function listenForArtistsBookStatusChanges(
  client: SanityClient,
  id: string,
): Observable<Record<string, any>> {
  const idParam = { id: id }
  return client.listen(artistsBooksStatusChangesById, idParam)
}
