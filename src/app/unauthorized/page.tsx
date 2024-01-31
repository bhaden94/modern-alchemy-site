import { Suspense } from 'react'

import PageContainer from '~/components/PageContainer'

import Unauthorized from './Unauthorized'

export default function UnauthorizedPage({
  searchParams,
}: {
  searchParams: { redirectUrl: string }
}) {
  return (
    <PageContainer>
      <Suspense>
        <Unauthorized redirectUrl={searchParams.redirectUrl} />
      </Suspense>
    </PageContainer>
  )
}
