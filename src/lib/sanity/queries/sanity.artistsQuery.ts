import { DateValue } from '@mantine/dates'
import { groq } from 'next-sanity'
import { Observable } from 'rxjs'
import { SanityClient } from 'sanity'

import { Artist } from '~/types/SanitySchemaTypes'

const artistssQuery = groq`*[_type == "artist"]{
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
  return await client.fetch(artistssQuery)
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

const artistsNameQuery = groq`*[_type == "artist" && name == $name][0]{
  ...,
  headshot{
    ...,
    _type == "image" => {
      ...,
      asset->
    }
  }
}`
export async function getArtistByName(
  client: SanityClient,
  name: string,
): Promise<Artist> {
  const nameParam = { name: name }
  return await client.fetch(artistsNameQuery, nameParam)
}

export interface BooksStatus {
  booksOpen: boolean
  booksOpenAt: DateValue
}

const artistsBooksStatus = groq`*[_type == "artist" && name == $name][0]{booksOpen, booksOpenAt}`
export function getArtistBooksStatus(
  client: SanityClient,
  name: string,
): Promise<BooksStatus> {
  const nameParam = { name: name }
  return client.fetch(artistsBooksStatus, nameParam)
}

export function listenForArtistsBookStatusChanges(
  client: SanityClient,
  name: string,
): Observable<Record<string, any>> {
  const nameParam = { name: name }
  return client.listen(artistsBooksStatus, nameParam)
}
