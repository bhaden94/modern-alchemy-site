'use client'

import { Button } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

import { Artist } from '~/schemas/models/artist'
import { NavigationPages } from '~/utils/navigation'

import ArtistCard from '../Artists/ArtistCard'
import PageTitle from '../PageTitle/PageTitle'
import PortfolioCarousel from '../PortfolioCarousel/PortfolioCarousel'

interface IBookingInfo {
  artist: Artist
}

const ArtistPortfolio = ({ artist }: IBookingInfo) => {
  return (
    <>
      <PageTitle title={`${artist.name} Portfolio`} />
      <Link href={NavigationPages.Artists}>
        <Button variant="outline">
          <IconArrowLeft />
          Back to artists
        </Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 my-8">
        <div className="md:col-span-2 justify-self-center">
          <ArtistCard artist={artist} />
        </div>
        <div className="md:col-span-3">
          {artist.portfolioImages?.length > 0 ? (
            <PortfolioCarousel images={artist.portfolioImages} />
          ) : (
            'Portfolio in progress...'
          )}
        </div>
      </div>
    </>
  )
}

export default ArtistPortfolio
