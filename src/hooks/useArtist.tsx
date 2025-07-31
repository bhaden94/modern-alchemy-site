'use client'

import React, { createContext, useContext, useState } from 'react'

import { Artist } from '~/schemas/models/artist'
import { MailingListContent } from '~/schemas/models/mailingList'

type ArtistContextType = {
  artist: Artist
  updateArtist: (artist: Artist) => void
  mailingList?: MailingListContent
}

const ArtistContext = createContext<ArtistContextType>({
  artist: {
    _type: 'artist',
    _id: '',
    _createdAt: '',
    email: '',
    name: '',
    booksOpen: false,
    booksOpenAt: null,
    shouldEmailBookings: false,
    isActive: false,
  },
  updateArtist: () => {},
})

interface IArtistProvider {
  artist: Artist
  mailingList?: MailingListContent
  children: React.ReactNode
}

export const ArtistProvider = ({
  artist,
  mailingList,
  children,
}: IArtistProvider) => {
  const [currentArtist, setArtist] = useState<Artist>(artist)

  return (
    <ArtistContext.Provider
      value={{
        artist: currentArtist,
        updateArtist: setArtist,
        mailingList: mailingList,
      }}
    >
      {children}
    </ArtistContext.Provider>
  )
}

export const useArtist = () => useContext(ArtistContext) as ArtistContextType
