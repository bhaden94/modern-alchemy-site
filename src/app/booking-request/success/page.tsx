import SuccessfullBooking from '~/components/BookingRequests/SuccessfullBooking'
import PageContainer from '~/components/PageContainer'

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
