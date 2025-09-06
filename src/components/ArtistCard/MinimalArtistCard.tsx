'use client'

import { Anchor, Avatar, BoxProps, Stack, Text } from '@mantine/core'
import Link from 'next/link'

import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { resolveArtistUrl } from '~/lib/sanity/sanity.links'
import { Artist } from '~/schemas/models/artist'
import { NavigationPages } from '~/utils/navigation'

interface IMinimalArtistCard extends BoxProps {
  artist: Artist
  showPortfolioLink?: boolean
}

const MinimalArtistCard = ({
  artist,
  showPortfolioLink,
  ...props
}: IMinimalArtistCard) => {
  const BookingLink = () => {
    if (
      artist.bookingType === 'ExternalBookingLink' &&
      artist.externalBookingLink
    ) {
      return (
        <Anchor
          component={Link}
          target="_blank"
          href={artist.externalBookingLink}
          underline="hover"
          c="primary"
        >
          {artist.externalBookingLink.startsWith('mailto')
            ? 'Send Email'
            : 'Go to booking site'}
        </Anchor>
      )
    }

    return (
      <Anchor
        component={Link}
        href={`${NavigationPages.BookingRequest}/${encodeURIComponent(
          resolveArtistUrl(artist),
        )}`}
        underline="hover"
        c="primary"
      >
        Submit booking request
      </Anchor>
    )
  }

  const PortfolioLink = () => {
    return (
      <Anchor
        component={Link}
        href={`${NavigationPages.Artists}/${encodeURIComponent(resolveArtistUrl(artist))}`}
        underline="hover"
        c="primary"
      >
        View Portfolio
      </Anchor>
    )
  }

  return (
    <Stack gap={0} {...props}>
      <Avatar
        src={getImageFromRef(artist.headshot)?.url || '/user.svg'}
        alt="Artist headshot"
      />
      <Text fw={600}>{artist.name}</Text>
      {showPortfolioLink && <PortfolioLink />}
      <BookingLink />
    </Stack>
  )
}

export default MinimalArtistCard
