import { Metadata } from 'next'

import PageContainer from '~/components/PageContainer'
import SuccessfullBooking from '~/components/SuccessfullBooking/SuccessfullBooking'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { name: string }
}): Promise<Metadata> {
  const title = `${decodeURIComponent(
    searchParams.name,
  )} Booking Request Success`
  const description = `Successfull booking request page for ${decodeURIComponent(
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
      <SuccessfullBooking artistName={decodeURIComponent(searchParams.name)} />
    </PageContainer>
  )
}

export default SuccessBookingRequestPage
