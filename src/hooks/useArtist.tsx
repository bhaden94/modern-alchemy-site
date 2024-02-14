'use client'

import React, { createContext, useContext, useState } from 'react'

import { Artist, Role } from '~/schemas/models/artist'

type ArtistContextType = {
  artist: Artist
  updateArtist: (artist: Artist) => void
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
    role: Role.EMPLOYEE,
    shouldEmailBookings: false,
  },
  updateArtist: () => {},
})

interface IArtistProvider {
  artist: Artist
  children: React.ReactNode
}

export const ArtistProvider = ({ artist, children }: IArtistProvider) => {
  const [currentArtist, setArtist] = useState<Artist>(artist)

  return (
    <ArtistContext.Provider
      value={{ artist: currentArtist, updateArtist: setArtist }}
    >
      {children}
    </ArtistContext.Provider>
  )
}

export const useArtist = () => useContext(ArtistContext) as ArtistContextType
