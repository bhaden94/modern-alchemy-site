import './styles/global.css'
import '@mantine/core/styles.css'
import '@mantine/dropzone/styles.css'
import '@mantine/carousel/styles.css'
import '@mantine/dates/styles.css'

import { ColorSchemeScript } from '@mantine/core'
import { GoogleTagManager } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/react'
import { Metadata } from 'next'

import AnnouncementBanner from '~/components/AnnouncementBanner/AnnouncementBanner'
import Footer from '~/components/Footer/Footer'
import Header from '~/components/Header/Header'
import Providers from '~/components/Providers'
import {
  getLayoutMetadata,
  getRootLayoutContent,
} from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'
import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { colorScheme } from '~/utils/theme'

export async function generateMetadata(): Promise<Metadata> {
  const client = getClient(undefined)
  const metadata = await getLayoutMetadata(client)

  if (!metadata) return {}

  return {
    title: {
      template: `%s | ${metadata.businessName}`,
      default: metadata.businessName,
    },
    description: metadata.description,
    openGraph: {
      title: {
        template: `%s | ${metadata.businessName}`,
        default: metadata.businessName,
      },
      description: metadata.description,
      images: getImageFromRef(metadata.openGraphImage)?.url,
    },
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
        {content.googleTagManagerId && (
          <GoogleTagManager gtmId={content.googleTagManagerId} />
        )}
      </head>
      <body className="flex min-h-screen flex-col">
        <Providers>
          {content.announcement && content.announcement.isActive ? (
            <AnnouncementBanner title={content.announcement.title} />
          ) : null}
          <Header
            logo={content?.businessLogo}
            navItems={content.navigationItems}
          />
          <div className="flex-1">{children}</div>
          <Footer
            logo={content?.businessLogo}
            copyrightText={content?.copyrightText}
            logoCaption={content?.businessLogoCaption}
            instagram={content?.instagramLink}
            facebook={content?.facebookLink}
            navItems={content.navigationItems}
          />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
