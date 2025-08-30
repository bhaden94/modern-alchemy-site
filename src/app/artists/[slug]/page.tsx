import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ArtistPortfolio from '~/components/ArtistPortfolio/ArtistPortfolio'
import PageContainer from '~/components/PageContainer'
import {
  getArtistByIdOrSlug,
  getArtists,
} from '~/lib/sanity/queries/sanity.artistsQuery'
import { getLayoutMetadata } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'
import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { resolveArtistUrl } from '~/lib/sanity/sanity.links'
import { formatStylesInSentence } from '~/utils'

export const generateStaticParams = async () => {
  const client = getClient(undefined)
  const artists = await getArtists(client)
  return artists.map((artist) => ({ slug: resolveArtistUrl(artist) }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const client = getClient(undefined)
  const artist = await getArtistByIdOrSlug(client, decodeURI(params.slug))
  const metadata = await getLayoutMetadata(client)

  if (!artist) return {}

  const title = `${artist.name} Portfolio`

  const formattedStyles = formatStylesInSentence(artist.styles)
  const stylesSection = formattedStyles ? `of ${formattedStyles} tattoos ` : ''

  const description = `Explore ${artist.name}’s portfolio ${stylesSection}at ${metadata.businessName} located in ${metadata.location}.`

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: getImageFromRef(artist.headshot)?.url,
    },
  }
}

const ArtistPortfolioPage = async ({
  params,
}: {
  params: { slug: string }
}) => {
  const client = getClient(undefined)
  const artist = await getArtistByIdOrSlug(client, decodeURI(params.slug))

  if (!artist || !artist.isActive) return notFound()

  return (
    <PageContainer>
      <ArtistPortfolio artist={artist} />
    </PageContainer>
  )
}

export default ArtistPortfolioPage
