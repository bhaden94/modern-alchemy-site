import './styles/global.css'
import '@mantine/core/styles.css'
import '@mantine/dropzone/styles.css'

import { ColorSchemeScript } from '@mantine/core'

import Container from '~/components/Container'
import Footer from '~/components/Footer/Footer'
import Header from '~/components/Header/Header'
import Providers from '~/components/Providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <Providers>
          <Header />
          <Container>{children}</Container>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
