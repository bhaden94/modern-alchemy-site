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
import {
  generateEnhancedMetadata,
  generateLocalBusinessSchema,
  generateOrganizationSchema,
} from '~/utils/seo'
import { colorScheme } from '~/utils/theme'

export async function generateMetadata(): Promise<Metadata> {
  const client = getClient(undefined)
  const metadata = await getLayoutMetadata(client)

  if (!metadata) return {}

  const imageUrl = getImageFromRef(metadata.openGraphImage)?.url

  return generateEnhancedMetadata({
    title: metadata.businessName,
    description:
      metadata.description ||
      `${metadata.businessName} - Professional tattoo studio in ${metadata.location}`,
    imageUrl,
    siteName: metadata.businessName,
    keywords: [
      'tattoo studio',
      'tattoo artist',
      'custom tattoos',
      metadata.city || '',
      metadata.state || '',
      metadata.businessName,
    ].filter(Boolean),
  })
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const client = getClient(undefined)
  const content = await getRootLayoutContent(client)
  const metadata = await getLayoutMetadata(client)

  // Generate structured data for local SEO
  const localBusinessSchema = metadata
    ? generateLocalBusinessSchema(metadata, process.env.NEXT_PUBLIC_SITE_URL)
    : null

  const organizationSchema =
    metadata && content.businessLogo
      ? generateOrganizationSchema(
          metadata,
          getImageFromRef(content.businessLogo)?.url,
        )
      : null

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme={colorScheme} />
        {content.googleTagManagerId && (
          <GoogleTagManager gtmId={content.googleTagManagerId} />
        )}
        {/* LocalBusiness structured data for SEO */}
        {localBusinessSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(localBusinessSchema),
            }}
          />
        )}
        {/* Organization structured data */}
        {organizationSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
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
