import { Button } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

import ArtistCard from '~/components/Artists/ArtistCard'
import PageContainer from '~/components/PageContainer'
import PortfolioCarousel from '~/components/PortfolioCarousel/PortfolioCarousel'
import {
  getArtistByName,
  getArtists,
} from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { NavigationPages } from '~/utils/navigation'

export const generateStaticParams = async () => {
  const client = getClient(undefined)
  const artists = await getArtists(client)
  return artists.map((artist) => ({ name: artist.name }))
}

const ArtistPortfolioPage = async ({
  params,
}: {
  params: { name: string }
}) => {
  const client = getClient(undefined)
  const artist = await getArtistByName(client, decodeURI(params.name))

  if (!artist) return <div>404</div>

  return (
    <PageContainer>
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
    </PageContainer>
  )
}

export default ArtistPortfolioPage
