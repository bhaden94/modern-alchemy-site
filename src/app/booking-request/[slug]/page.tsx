import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import BookStatuses from '~/components/BooksStatus/BookStatuses'
import PageContainer from '~/components/PageContainer'
import PageTitle from '~/components/PageTitle/PageTitle'
import {
  getArtistByIdOrSlug,
  getArtists,
} from '~/lib/sanity/queries/sanity.artistsQuery'
import { getDefaultMailingList } from '~/lib/sanity/queries/sanity.mailingListQuery'
import { getLayoutMetadata } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'
import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { resolveArtistUrl } from '~/lib/sanity/sanity.links'
import { formatStylesInSentence, isHttpUrl } from '~/utils'
import { generateEnhancedMetadata } from '~/utils/seo'

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

  const title = `${artist.name} Booking Request`

  const formattedStyles = formatStylesInSentence(artist.styles)
  const stylesSection = formattedStyles ? `for ${formattedStyles} tattoos ` : ''
  const locationParts = [metadata.city, metadata.state]
    .filter(Boolean)
    .join(', ')
  const description = `Submit a booking request ${stylesSection}with ${artist.name} at ${metadata.businessName} located in ${locationParts}.`

  return generateEnhancedMetadata({
    title,
    description,
    imageUrl: getImageFromRef(artist.headshot)?.url,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking-request/${params.slug}`,
    siteName: metadata.businessName,
    keywords: [
      artist.name,
      'tattoo booking',
      'book tattoo appointment',
      ...(artist.styles || []),
      metadata.city || '',
      metadata.state || '',
      metadata.businessName,
    ].filter(Boolean),
  })
}

const ArtistBookingRequestPage = async ({
  params,
}: {
  params: { slug: string }
}) => {
  const client = getClient(undefined)
  const artist = await getArtistByIdOrSlug(client, decodeURI(params.slug))
  // When we have an artist specific mailing list, we can get that here.
  const mailingList = await getDefaultMailingList(client)

  if (!artist || !artist.isActive) return notFound()

  if (
    artist.bookingType === 'ExternalBookingLink' &&
    artist.externalBookingLink &&
    isHttpUrl(artist.externalBookingLink)
  ) {
    redirect(artist.externalBookingLink)
  }

  return (
    <PageContainer>
      <PageTitle title={`Booking with ${artist.name}`} />
      <BookStatuses artist={artist} mailingList={mailingList} />
    </PageContainer>
  )
}

export default ArtistBookingRequestPage
