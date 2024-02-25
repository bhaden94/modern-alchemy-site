'use client'

import { ArtistProvider } from '~/hooks/useArtist'
import { Artist } from '~/schemas/models/artist'

import ArtistBooksStatus from './ArtistBookStatus/ArtistBooksStatus'

interface IBookStatuses {
  artists: Artist[]
  showForm?: boolean
}

const BookStatuses = ({ artists, showForm }: IBookStatuses) => {
  return (
    <>
      {artists?.map((artist) => (
        <ArtistProvider key={artist._id} artist={artist}>
          <ArtistBooksStatus showForm={showForm} />
        </ArtistProvider>
      ))}
    </>
  )
}

export default BookStatuses
