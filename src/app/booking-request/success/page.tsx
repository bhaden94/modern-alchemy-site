import PageContainer from '~/components/PageContainer'
import SuccessfullBooking from '~/components/SuccessfullBooking/SuccessfullBooking'

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
