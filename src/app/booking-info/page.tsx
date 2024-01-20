import { notFound } from 'next/navigation'

import BookingInfo from '~/components/BookingInfo/BookingInfo'
import PageContainer from '~/components/PageContainer'
import PageInProgress from '~/components/PageInProgress/PageInProgress'
import { getArtists } from '~/lib/sanity/queries/sanity.artistsQuery'
import { getBookingInfoPageContent } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'

const BookingInfoPage = async () => {
  const client = getClient(undefined)
  const content = await getBookingInfoPageContent(client)
  const artists = await getArtists(client)

  if (!content) return notFound()

  if (!content.isActive) {
    return <PageInProgress />
  }

  return (
    <PageContainer>
      <BookingInfo content={content} artists={artists} />
    </PageContainer>
  )
}

export default BookingInfoPage
