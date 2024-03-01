import { Metadata } from 'next'

import PageContainer from '~/components/PageContainer'
import SuccessfulBooking from '~/components/SuccessfulBooking/SuccessfulBooking'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { name: string }
}): Promise<Metadata> {
  const title = `${decodeURIComponent(
    searchParams.name,
  )} Booking Request Success`
  const description = `Successful booking request page for ${decodeURIComponent(
    searchParams.name,
  )}.`

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  }
}

const SuccessBookingRequestPage = async ({
  searchParams,
}: {
  searchParams: { name: string }
}) => {
  return (
    <PageContainer>
      <SuccessfulBooking artistName={decodeURIComponent(searchParams.name)} />
    </PageContainer>
  )
}

export default SuccessBookingRequestPage
