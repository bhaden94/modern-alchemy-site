'use client'

import { Button } from '@mantine/core'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

import { NavigationPages } from '~/utils/navigation'

const Unauthorized = ({ redirectUrl }: { redirectUrl: string }) => {
  return (
    <>
      <p>
        You are either not authorized to see that page, or something went wrong.
        Try signing in again.
      </p>
      <Button
        onClick={() =>
          signIn(undefined, {
            callbackUrl: redirectUrl || undefined,
          })
        }
      >
        Sign with a different account
      </Button>
      <Link href={NavigationPages.Home}>Home</Link>
    </>
  )
}
export default Unauthorized
