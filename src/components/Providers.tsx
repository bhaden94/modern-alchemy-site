'use client'

import { MantineProvider } from '@mantine/core'

import { FeatureProvider } from '~/context/FeatureFlagsContext'
import { theme } from '~/utils/theme'

// TODO: choose where we want live previews and how to set them up without exposing sanity tokens to the client
// const PreviewProvider = lazy(() => import('~/components/PreviewProvider'))

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <FeatureProvider>{children}</FeatureProvider>
    </MantineProvider>
  )
}
