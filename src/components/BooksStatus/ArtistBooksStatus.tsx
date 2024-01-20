'use client'

import { Loader, Text } from '@mantine/core'
import { DateValue } from '@mantine/dates'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import {
  BooksStatus,
  listenForArtistsBookStatusChanges,
} from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { NavigationPages } from '~/utils/navigation'

import BooksOpenAt from './BooksOpenAt'

interface IBooksStatus {
  booksStatus: BooksStatus
  showForm?: boolean
}

const TattooForm = dynamic(
  () => import('~/components/BooksStatus/TattooForm'),
  {
    loading: () => (
      <div className="flex flex-col items-center">
        <Loader />
      </div>
    ),
  },
)

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

const ShowWhenBooksOpen = ({
  showForm,
  artistId,
  artistName,
}: {
  showForm: boolean
  artistId: string
  artistName: string
}) => {
  if (showForm) {
    return <TattooForm artistId={artistId} />
  }

  return (
    <Link
      href={`${NavigationPages.BookingRequest}/${encodeURIComponent(artistId)}`}
      passHref
    >
      <Text component="a">{artistName}:&nbsp;Click to book now</Text>
    </Link>
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
        <ShowWhenBooksOpen
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
