import { DateValue } from '@mantine/dates'
import { groq } from 'next-sanity'
import { Observable } from 'rxjs'
import { SanityClient } from 'sanity'

import { Artist } from '~/types/SanitySchemaTypes'

const artistsQuery = groq`*[_type == "artist"]{
  ...,
  headshot{
    ...,
    _type == "image" => {
      ...,
      asset->
    }
  }
}`
export async function getArtists(client: SanityClient): Promise<Artist[]> {
  return await client.fetch(artistsQuery)
}

const artistsEmailQuery = groq`*[_type == "artist" && email == $email][0]{
  ...,
  headshot{
    ...,
    _type == "image" => {
      ...,
      asset->
    }
  }
}`
export async function getArtistByEmail(
  client: SanityClient,
  email: string,
): Promise<Artist> {
  const emailParam = { email: email }
  return await client.fetch(artistsEmailQuery, emailParam)
}

const artistsIdByNameQuery = groq`*[_type == "artist" && name == $name][0]{_id}`
export async function getArtistIdByName(
  client: SanityClient,
  name: string,
): Promise<{ _id: string }> {
  const nameParam = { name: name }
  return await client.fetch(artistsIdByNameQuery, nameParam)
}

const artistsIdQuery = groq`*[_type == "artist" && _id == $id][0]{
  ...,
  headshot{
    ...,
    _type == "image" => {
      ...,
      asset->
    }
  },
  portfolioImages[]{
    ...,
    _type == "image" => {
      ...,
      asset->
    }
  }
}`
export async function getArtistById(
  client: SanityClient,
  id: string,
): Promise<Artist> {
  const idParam = { id: id }
  return await client.fetch(artistsIdQuery, idParam)
}

export interface BooksStatus {
  booksOpen: boolean
  booksOpenAt: DateValue
  name: string
  _id: string
}

const artistsBooksStatus = groq`*[_type == "artist" && name == $name][0]{booksOpen, booksOpenAt, name, _id}`
export function getArtistBooksStatus(
  client: SanityClient,
  name: string,
): Promise<BooksStatus> {
  const nameParam = { name: name }
  return client.fetch(artistsBooksStatus, nameParam)
}

const artistBookingStatusesQuery = groq`*[_type == "artist" && _id in $artistIds]{booksOpen, booksOpenAt, name, _id}`
export function getArtistBookingStatuses(
  client: SanityClient,
  artistIds: string[],
): Promise<BooksStatus[]> {
  const idsParam = { artistIds: artistIds }
  return client.fetch(artistBookingStatusesQuery, idsParam)
}

const artistsBooksstatusChangesById = groq`*[_type == "artist" && _id == $id][0]{booksOpen, booksOpenAt, name, _id}`
export function listenForArtistsBookStatusChanges(
  client: SanityClient,
  id: string,
): Observable<Record<string, any>> {
  const idParam = { id: id }
  return client.listen(artistsBooksstatusChangesById, idParam)
}
