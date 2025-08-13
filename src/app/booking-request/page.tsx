import { redirect } from 'next/navigation'

import { getActiveArtists } from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { NavigationPages } from '~/utils/navigation'

const BookingRequestPage = async () => {
  const client = getClient(undefined)
  const artists = await getActiveArtists(client)

  if (artists.length > 0) {
    redirect(`${NavigationPages.BookingRequest}/${artists[0]._id}`)
  }

  redirect(NavigationPages.Home)
}

export default BookingRequestPage
