'use client'

import { Button, Group, Text } from '@mantine/core'
import { DateValue } from '@mantine/dates'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import {
  BooksStatus,
  listenForArtistsBookStatusChanges,
} from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { Artist } from '~/types/SanitySchemaTypes'
import { NavigationPages } from '~/utils/navigation'

import BooksOpenAt from '../BooksStatus/BooksOpenAt'

interface IArtistCardBookingRequest {
  artist: Artist
}

const ShowWhenBooksClosed = ({ booksOpenAt }: { booksOpenAt: DateValue }) => {
  return (
    <Group justify="center" mt="auto" pb={6} pt={18} gap={0}>
      <Text>Books closed and will open on</Text>
      <BooksOpenAt date={booksOpenAt} />
    </Group>
  )
}

const ShowWhenBooksOpen = ({ artistId }: { artistId: string }) => {
  return (
    <Group justify="center" mt="auto" pb={6} pt={18}>
      <Link
        href={`${NavigationPages.BookingRequest}/${encodeURIComponent(
          artistId,
        )}`}
      >
        <Button radius="sm">submit booking request</Button>
      </Link>
    </Group>
  )
}

const ArtistCardBookingRequest = ({ artist }: IArtistCardBookingRequest) => {
  const [artistBooksStatus, setArtistBooksStatus] = useState<BooksStatus>({
    name: artist.name,
    _id: artist._id,
    booksOpen: artist.booksOpen,
    booksOpenAt: artist.booksOpenAt,
  })

  useEffect(() => {
    const client = getClient(undefined)
    const subscription = listenForArtistsBookStatusChanges(
      client,
      artist._id,
    ).subscribe((update) => {
      setArtistBooksStatus({
        booksOpen: update?.result?.booksOpen,
        booksOpenAt: update?.result?.booksOpenAt,
        name: update?.result?.name,
        _id: update?.result?._id,
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {artistBooksStatus.booksOpen ? (
        <ShowWhenBooksOpen artistId={artistBooksStatus._id} />
      ) : (
        <ShowWhenBooksClosed booksOpenAt={artistBooksStatus.booksOpenAt} />
      )}
    </>
  )
}

export default ArtistCardBookingRequest
