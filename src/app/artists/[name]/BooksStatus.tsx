'use client'

import { useEffect, useState } from 'react'

import TattooForm from '~/components/TattooForm'
import {
  BooksStatus,
  getArtistBooksStatus,
  listenForArtistsBookStatusChanges,
} from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'

const BooksOpenAt = ({ date }: { date: Date | null }) => {
  if (!date) return undefined
  const dateType = new Date(date)
  return <div>{dateType.toLocaleString()}</div>
}

const BooksStatus = ({ name, id }: { name: string; id: string }) => {
  const [booksStatus, setBooksStatus] = useState<BooksStatus>({
    booksOpen: false,
    booksOpenAt: null,
  })

  useEffect(() => {
    const client = getClient(undefined)
    const fetchBooksStatus = async () => {
      const currBooksStatus = await getArtistBooksStatus(
        client,
        decodeURI(name),
      )
      setBooksStatus(currBooksStatus)
    }

    fetchBooksStatus()

    const subscription = listenForArtistsBookStatusChanges(
      client,
      decodeURI(name),
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
      {booksStatus.booksOpen ? (
        <TattooForm artistName={name} artistId={id} />
      ) : (
        <BooksOpenAt date={booksStatus.booksOpenAt} />
      )}
    </>
  )
}

export default BooksStatus
