'use client'

import { ArtistProvider } from '~/hooks/useArtist'
import { Artist } from '~/schemas/models/artist'

import ArtistBooksStatus from './ArtistBookStatus/ArtistBooksStatus'

interface IBookStatuses {
  artists: Artist[]
}

const BookStatuses = ({ artists }: IBookStatuses) => {
  return (
    <>
      {artists?.map((artist) => (
        <ArtistProvider key={artist._id} artist={artist}>
          <ArtistBooksStatus />
        </ArtistProvider>
      ))}
    </>
  )
}

export default BookStatuses
