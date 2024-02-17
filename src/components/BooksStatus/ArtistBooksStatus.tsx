'use client'

import { useEffect } from 'react'

import { useArtist } from '~/hooks/useArtist'
import { listenForArtistsBookStatusChanges } from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'

import ShowBooksClosed from './ShowBooksClosed'
import ShowBooksOpen from './ShowBooksOpen'

interface IBooksStatus {
  showForm?: boolean
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
        <ShowBooksClosed />
      )}
    </>
  )
}

export default ArtistBooksStatus
