import './styles/global.css'
import '@mantine/core/styles.css'
import '@mantine/dropzone/styles.css'

// import '@/styles/globals.css'
import { IBM_Plex_Mono, Inter, PT_Serif } from 'next/font/google'

import Providers from '~/components/Providers'
import { ThemeSwitcher } from '~/components/ThemeSwitcher'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <Providers>
          {/* <ThemeSwitcher /> */}
          {children}
        </Providers>
      </body>
    </html>
  )
}
