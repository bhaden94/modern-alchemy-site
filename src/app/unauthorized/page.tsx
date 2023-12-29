'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

import PageContainer from '~/components/PageContainer'
import { REDIRECT_URL } from '~/lib/next-auth/auth.utils'

// TODO: fix error - Entire page /unauthorized deopted into client-side rendering. https://nextjs.org/docs/messages/deopted-into-client-rendering /unauthorized
export default function UnauthorizedPage() {
  const searchParams = useSearchParams()

  return (
    <PageContainer>
      <p>You are not authoirzed to view this page.</p>
      <button
        onClick={() =>
          signIn(undefined, {
            callbackUrl: searchParams?.get(REDIRECT_URL) || undefined,
          })
        }
      >
        Sign with a different account
      </button>
      <Link href="/">Home</Link>
    </PageContainer>
  )
}
