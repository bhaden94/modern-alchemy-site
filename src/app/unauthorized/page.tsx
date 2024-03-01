import { Metadata } from 'next'
import { Suspense } from 'react'

import PageContainer from '~/components/PageContainer'

import Unauthorized from './Unauthorized'

export const metadata: Metadata = {
  title: 'Unauthorized',
  description: 'Unauthorized request redirect page.',
}

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
