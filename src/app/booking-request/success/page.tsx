import { Metadata } from 'next'

import PageContainer from '~/components/PageContainer'
import SuccessfullBooking from '~/components/SuccessfullBooking/SuccessfullBooking'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { name: string }
}): Promise<Metadata> {
  return {
    title: `${decodeURIComponent(searchParams.name)} Booking Request Success`,
    description: `Successfull booking request page for ${decodeURIComponent(
      searchParams.name,
    )}.`,
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
