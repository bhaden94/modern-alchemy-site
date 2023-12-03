'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

import { REDIRECT_URL } from '~/lib/next-auth/auth.utils'

export default function UnauthorizedPage() {
  const searchParams = useSearchParams()

  return (
    <>
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
    </>
  )
}
