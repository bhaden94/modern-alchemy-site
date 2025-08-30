import { redirect } from 'next/navigation'

import { getActiveArtists } from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { resolveArtistUrl } from '~/lib/sanity/sanity.links'
import { NavigationPages } from '~/utils/navigation'

const BookingRequestPage = async () => {
  const client = getClient(undefined)
  const artists = await getActiveArtists(client)

  if (artists.length > 0) {
    redirect(
      `${NavigationPages.BookingRequest}/${resolveArtistUrl(artists[0])}`,
    )
  }

  redirect(NavigationPages.Home)
}

export default BookingRequestPage
