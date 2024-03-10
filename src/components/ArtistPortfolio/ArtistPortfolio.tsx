'use client'

import { Button } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

import { Artist } from '~/schemas/models/artist'
import { NavigationPages } from '~/utils/navigation'

import ArtistCard from '../ArtistCard/ArtistCard'
import PageTitle from '../PageTitle/PageTitle'
import CarouselWithThumbnails from '../CarouselWithThumbnails/CarouselWithThumbnails'

interface IBookingInfo {
  artist: Artist
}

const ArtistPortfolio = ({ artist }: IBookingInfo) => {
  return (
    <>
      <PageTitle title={`${artist.name} Portfolio`} />
      <Button component={Link} href={NavigationPages.Artists} variant="outline">
        <IconArrowLeft />
        Back to artists
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 my-8">
        <div className="md:col-span-2 justify-self-center">
          <ArtistCard artist={artist} />
        </div>
        <div className="md:col-span-3">
          {artist.portfolioImages && artist.portfolioImages.length > 0 ? (
            <CarouselWithThumbnails images={artist.portfolioImages} />
          ) : (
            'Portfolio in progress...'
          )}
        </div>
      </div>
    </>
  )
}

export default ArtistPortfolio
