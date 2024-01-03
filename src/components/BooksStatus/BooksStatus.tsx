'use client'

import { Text } from '@mantine/core'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import TattooForm from '~/components/BooksStatus/TattooForm'
import {
  BooksStatus,
  getArtistBooksStatus,
  listenForArtistsBookStatusChanges,
} from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { NavigationPages } from '~/utils/navigation'

import BooksOpenAt from './BooksOpenAt'

interface IBooksStatus {
  name: string
  id: string
  showForm?: boolean
}

const BooksStatus = (props: IBooksStatus) => {
  const { name, id, showForm } = props

  const [booksStatus, setBooksStatus] = useState<BooksStatus>({
    booksOpen: false,
    booksOpenAt: null,
  })

  const ShowWhenBooksOpen = () => {
    if (showForm) {
      return <TattooForm artistId={id} />
    }

    return (
      <Link
        href={`${NavigationPages.BookingRequest}/${encodeURIComponent(name)}`}
      >
        <Text>{name}:&nbsp;Click to book now</Text>
      </Link>
    )
  }

  const ShowWhenBooksClosed = () => {
    return (
      <>
        <Text span>{name}:&nbsp;</Text>
        <BooksOpenAt date={booksStatus.booksOpenAt} />
      </>
    )
  }

  useEffect(() => {
    const client = getClient(undefined)
    const fetchBooksStatus = async () => {
      const currBooksStatus = await getArtistBooksStatus(client, name)
      setBooksStatus(currBooksStatus)
    }

    fetchBooksStatus()

    const subscription = listenForArtistsBookStatusChanges(
      client,
      name,
    ).subscribe((update) => {
      setBooksStatus({
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
      {booksStatus.booksOpen ? <ShowWhenBooksOpen /> : <ShowWhenBooksClosed />}
    </>
  )
}

export default BooksStatus
