'use client'

import { Button } from '@mantine/core'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Suspense } from 'react'

import PageContainer from '~/components/PageContainer'
import { REDIRECT_URL } from '~/lib/next-auth/auth.utils'
import { NavigationPages } from '~/utils/navigation'

const Unauthorized = () => {
  const searchParams = useSearchParams()

  return (
    <>
      <p>You are not authorized to view this page.</p>
      <Button
        onClick={() =>
          signIn(undefined, {
            callbackUrl: searchParams?.get(REDIRECT_URL) || undefined,
          })
        }
      >
        Sign with a different account
      </Button>
      <Link href={NavigationPages.Home}>Home</Link>
    </>
  )
}

export default function UnauthorizedPage() {
  return (
    <PageContainer>
      <Suspense>
        <Unauthorized />
      </Suspense>
    </PageContainer>
  )
}
