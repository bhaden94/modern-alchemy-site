'use client'

import { lazy } from 'react'

import { FeatureProvider } from '~/components/FeatureProvider'
import { readToken } from '~/lib/sanity/sanity.api'

const PreviewProvider = lazy(() => import('~/components/PreviewProvider'))

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FeatureProvider>
      {false ? (
        <PreviewProvider token={readToken}>{children}</PreviewProvider>
      ) : (
        children
      )}
    </FeatureProvider>
  )
}
