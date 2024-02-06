'use client'

import { MantineProvider } from '@mantine/core'

import { colorScheme, theme } from '~/utils/theme'

// const PreviewProvider = lazy(() => import('~/components/PreviewProvider'))

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme={colorScheme}>
      {children}
    </MantineProvider>
  )
}
