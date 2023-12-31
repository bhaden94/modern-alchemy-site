'use client'

import { Text } from '@mantine/core'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import TattooForm from '~/components/TattooForm'
import {
  BooksStatus,
  getArtistBooksStatus,
  listenForArtistsBookStatusChanges,
} from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { NavigationPages } from '~/utils/navigation'

interface IBooksStatus {
  name: string
  id: string
  showForm?: boolean
}

const BooksOpenAt = ({ date }: { date: Date | null }) => {
  if (!date) return undefined
  const options = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  } as const
  const dateType = new Date(date)
  return <Text span>{dateType.toLocaleString('en-US', options)}</Text>
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
      <Link href={`${NavigationPages.BookingRequest}/${name}`}>
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
