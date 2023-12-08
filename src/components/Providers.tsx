'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

import { FeatureProvider } from '~/context/FeatureFlagsContext'

// TODO: choose where we want live previews and how to set them up without exposing sanity tokens to the client
// const PreviewProvider = lazy(() => import('~/components/PreviewProvider'))

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider defaultTheme="dark">
        <FeatureProvider>{children}</FeatureProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}
