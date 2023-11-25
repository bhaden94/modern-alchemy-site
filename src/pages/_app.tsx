import '~/styles/global.css'

import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { IBM_Plex_Mono, Inter, PT_Serif } from 'next/font/google'
import { lazy, useEffect, useState } from 'react'
import { FeatureProvider, useFeatures } from '~/components/FeatureProvider'
import { getClient } from '~/lib/sanity/sanity.client'
import { groq } from 'next-sanity'
import {
  FeatureFlag,
  getFeatureFlags,
  listenForFeatureFlagChanges,
} from '~/lib/sanity/sanity.queries'

export interface SharedPageProps {
  //session: Session | null
  draftMode: boolean
  token: string
}

const PreviewProvider = lazy(() => import('~/components/PreviewProvider'))

const mono = IBM_Plex_Mono({
  variable: '--font-family-mono',
  subsets: ['latin'],
  weight: ['500', '700'],
})

const sans = Inter({
  variable: '--font-family-sans',
  subsets: ['latin'],
  weight: ['500', '700', '800'],
})

const serif = PT_Serif({
  variable: '--font-family-serif',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['400', '700'],
})

// CSS for site or add Material UI
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { draftMode, token } = pageProps

  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-family-sans: ${sans.style.fontFamily};
            --font-family-serif: ${serif.style.fontFamily};
            --font-family-mono: ${mono.style.fontFamily};
          }
        `}
      </style>
      <SessionProvider session={session}>
        <FeatureProvider>
          {draftMode ? (
            <PreviewProvider token={token}>
              <Component {...pageProps} />
            </PreviewProvider>
          ) : (
            <Component {...pageProps} />
          )}
        </FeatureProvider>
      </SessionProvider>
    </>
  )
}
