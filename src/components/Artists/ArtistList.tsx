'use client'

import { Artist } from '~/types/SanitySchemaTypes'

import ArtistCard from './ArtistCard'

const ArtistList = ({ artists }: { artists: Artist[] }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {artists?.map((artist) => (
        <ArtistCard key={artist.name} artist={artist} showPortfolioLink />
      ))}
    </div>
  )
}

export default ArtistList
