'use client'

import { MantineProvider } from '@mantine/core'

import { ErrorDialogProvider } from '~/hooks/useErrorDialog'
import { colorScheme, cssVariableResolver, theme } from '~/utils/theme'

// const PreviewProvider = lazy(() => import('~/components/PreviewProvider'))

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={cssVariableResolver}
      defaultColorScheme={colorScheme}
    >
      <ErrorDialogProvider>{children}</ErrorDialogProvider>
    </MantineProvider>
  )
}
