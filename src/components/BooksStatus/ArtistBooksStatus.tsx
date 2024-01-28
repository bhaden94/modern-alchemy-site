'use client'

import { Text } from '@mantine/core'
import { DateValue } from '@mantine/dates'
import { useEffect, useState } from 'react'

import {
  BooksStatus,
  listenForArtistsBookStatusChanges,
} from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'

import BooksOpenAt from './BooksOpenAt'
import ShowBooksOpen from './ShowBooksOpen'

interface IBooksStatus {
  booksStatus: BooksStatus
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
  const { booksStatus, showForm } = props

  const [artistBooksStatus, setArtistBooksStatus] =
    useState<BooksStatus>(booksStatus)

  useEffect(() => {
    const client = getClient(undefined)
    const subscription = listenForArtistsBookStatusChanges(
      client,
      booksStatus._id,
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
        <ShowBooksOpen
          showForm={!!showForm}
          artistId={artistBooksStatus._id}
          artistName={artistBooksStatus.name}
        />
      ) : (
        <ShowWhenBooksClosed
          name={artistBooksStatus.name}
          booksOpenAt={artistBooksStatus.booksOpenAt}
        />
      )}
    </>
  )
}

export default ArtistBooksStatus
