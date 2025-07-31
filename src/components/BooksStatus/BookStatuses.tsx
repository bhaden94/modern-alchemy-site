'use client'

import { ArtistProvider } from '~/hooks/useArtist'
import { Artist } from '~/schemas/models/artist'
import { MailingListContent } from '~/schemas/models/mailingList'

import ArtistBooksStatus from './ArtistBookStatus/ArtistBooksStatus'

interface IBookStatuses {
  artist: Artist
  mailingList?: MailingListContent
}

const BookStatuses = ({ artist, mailingList }: IBookStatuses) => {
  return (
    <>
      <ArtistProvider
        key={artist._id}
        artist={artist}
        mailingList={mailingList}
      >
        <ArtistBooksStatus />
      </ArtistProvider>
    </>
  )
}

export default BookStatuses
