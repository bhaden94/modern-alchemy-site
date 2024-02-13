'use client'

import { Text } from '@mantine/core'
import { DateValue } from '@mantine/dates'
import { useEffect } from 'react'

import { useArtist } from '~/hooks/useArtist'
import {
  BooksStatus,
  listenForArtistsBookStatusChanges,
} from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'

import BooksOpenAt from './BooksOpenAt'
import ShowBooksOpen from './ShowBooksOpen'

interface IBooksStatus {
  showForm?: boolean
}

const ShowWhenBooksClosed = ({
  name,
  booksOpenAt,
}: {
  name: string
  booksOpenAt: DateValue
}) => {
  return (
    <div>
      <Text span>{name}:&nbsp;</Text>
      <BooksOpenAt date={booksOpenAt} />
    </div>
  )
}

const ArtistBooksStatus = (props: IBooksStatus) => {
  const { showForm } = props
  const { artist, updateArtist } = useArtist()

  useEffect(() => {
    const client = getClient(undefined)
    const subscription = listenForArtistsBookStatusChanges(
      client,
      artist._id,
    ).subscribe((update) => {
      updateArtist({
        ...artist,
        booksOpen: update?.result?.booksOpen,
        booksOpenAt: update?.result?.booksOpenAt,
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {artist.booksOpen ? (
        <ShowBooksOpen showForm={!!showForm} />
      ) : (
        <ShowWhenBooksClosed
          name={artist.name}
          booksOpenAt={artist.booksOpenAt}
        />
      )}
    </>
  )
}

export default ArtistBooksStatus
