'use client'

import { Artist } from '~/schemas/models/artist'

import ArtistCard from '../../ArtistCard/ArtistCard'

interface IArtistList {
  artists: Artist[]
  showPortfolioLink?: boolean
}

const ArtistList = ({ artists, showPortfolioLink = false }: IArtistList) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {artists?.map((artist) => (
        <ArtistCard
          key={artist.name}
          artist={artist}
          showPortfolioLink={showPortfolioLink}
        />
      ))}
    </div>
  )
}

export default ArtistList
