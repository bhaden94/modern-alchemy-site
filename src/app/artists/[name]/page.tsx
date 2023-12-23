import { Button } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

import PageContainer from '~/components/Container'
import TattooForm from '~/components/TattooForm'
import {
  getArtistBooksStatus,
  getArtistByName,
  getArtists,
} from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'

import BooksStatus from './BooksStatus'

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
      <Link href="/artists">
        <Button variant="outline">
          <IconArrowLeft />
          Back to artists
        </Button>
      </Link>
      <div>Artist: {artist.name}</div>
      <div>Email: {artist.email}</div>
      <div>Instagram: {artist.instagram}</div>
      <BooksStatus name={params.name} />
    </PageContainer>
  )
}

export default ArtistPortfolioPage
