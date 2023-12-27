'use client'

import {
  Button,
  createTheme,
  DEFAULT_THEME,
  Input,
  Loader,
  mergeMantineTheme,
} from '@mantine/core'
import { Open_Sans, Raleway } from 'next/font/google'

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
})

const raleway = Raleway({
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['400', '700'],
})

const themeOverride = createTheme({
  primaryColor: 'violet',
  defaultGradient: {
    from: 'violet.6',
    to: 'violet.9',
    deg: 45,
  },
  fontFamily: raleway.style.fontFamily,
  headings: { fontFamily: openSans.style.fontFamily },
  defaultRadius: 'xs',
  components: {
    Button: Button.extend({
      defaultProps: {
        tt: 'uppercase',
        radius: 'xl',
        loaderProps: {
          type: 'oval',
        },
      },
    }),
    Loader: Loader.extend({
      defaultProps: {
        size: 'xl',
        type: 'bars',
      },
    }),
    Input: Input.extend({
      defaultProps: {
        size: 'xl',
      },
    }),
  },
})

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride)
export const colorScheme: 'dark' | 'light' = 'dark'
