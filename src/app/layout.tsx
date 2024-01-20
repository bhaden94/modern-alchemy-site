import './styles/global.css'
import '@mantine/core/styles.css'
import '@mantine/dropzone/styles.css'
import '@mantine/carousel/styles.css'
import '@mantine/dates/styles.css'

import { ColorSchemeScript } from '@mantine/core'
import { Metadata } from 'next'

import Footer from '~/components/Footer/Footer'
import Header from '~/components/Header/Header'
import Providers from '~/components/Providers'
import {
  getLayoutMetadata,
  getRootLayoutContent,
} from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'
import { colorScheme } from '~/utils/theme'

export async function generateMetadata(): Promise<Metadata> {
  const client = getClient(undefined)
  const metadata = await getLayoutMetadata(client)

  if (!metadata) return {}

  return {
    title: metadata.businessName,
    description: metadata.description,
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const client = getClient(undefined)
  const content = await getRootLayoutContent(client)

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme={colorScheme} />
      </head>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header logo={content.businessLogo.asset} />
          <div className="flex-1">{children}</div>
          <Footer
            logo={content.businessLogo.asset}
            copywriteText={content.copywriteText}
            logoCaption={content.businessLogoCaption}
            instagram={content.intagramLink}
            facebook={content.facebookLink}
          />
        </Providers>
      </body>
    </html>
  )
}
