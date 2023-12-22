import { Button } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

import Container from '~/components/Container'
import TattooForm from '~/components/TattooForm'

const artists = ['artist1', 'artist2', 'artist3']

export const generateStaticParams = () => {
  return artists.map((artist) => ({ name: artist }))
}

const ArtistPortfolioPage = ({ params }: { params: { name: string } }) => {
  if (!artists.some((artist) => params.name === artist)) return <div>404</div>

  return (
    <>
      <Link href="/artists">
        <Button variant="outline">
          <IconArrowLeft />
          Back to artists
        </Button>
      </Link>
      <div>Artist: {params.name}</div>
      <TattooForm />
    </>
  )
}

export default ArtistPortfolioPage
