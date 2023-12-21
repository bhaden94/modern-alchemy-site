import './styles/global.css'
import '@mantine/core/styles.css'
import '@mantine/dropzone/styles.css'

import { ColorSchemeScript } from '@mantine/core'

import Providers from '~/components/Providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
