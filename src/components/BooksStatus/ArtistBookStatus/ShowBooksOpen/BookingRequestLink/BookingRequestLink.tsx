'use client'

import { Anchor } from '@mantine/core'
import Link from 'next/link'

import { useArtist } from '~/hooks/useArtist'
import { NavigationPages } from '~/utils/navigation'

const BookingRequestLink = () => {
  const { artist } = useArtist()

  if (artist.externalBookingLink) {
    return (
      <Anchor
        component={Link}
        href={artist.externalBookingLink}
        target="_blank"
        display="block"
      >
        {artist.name}:&nbsp;
        {artist.externalBookingLink.startsWith('mailto')
          ? 'Send Email'
          : 'Go to booking site'}
      </Anchor>
    )
  }

  return (
    <Anchor
      component={Link}
      href={`${NavigationPages.BookingRequest}/${encodeURIComponent(artist._id)}`}
      display="block"
    >
      {artist.name}:&nbsp;Click to book now
    </Anchor>
  )
}

export default BookingRequestLink
