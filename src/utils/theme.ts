'use client'

import {
  ActionIcon,
  Button,
  createTheme,
  CSSVariablesResolver,
  DEFAULT_THEME,
  Divider,
  Input,
  Loader,
  LoadingOverlay,
  mergeMantineTheme,
  rem,
  Text,
} from '@mantine/core'
import { EB_Garamond } from 'next/font/google'

const ebGaramond = EB_Garamond({
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  display: 'swap',
})

const themeOverride = createTheme({
  primaryColor: 'academia',
  white: '#dfcda9',
  colors: {
    dark: [
      '#dfcda9',
      '#B8B8B8',
      '#828282',
      '#696969',
      '#424242',
      '#3B3B3B',
      '#1F1F1F',
      '#141414',
      '#1F1F1F',
      '#141414',
    ],
    // original academia
    // keep until happy with colors
    // academia: [
    //   '#f3f7f3',
    //   '#e5ebe5',
    //   '#c8d6c8',
    //   '#a7c0a7',
    //   '#8cae8b',
    //   '#7aa27a',
    //   '#709d70',
    //   '#5e895e',
    //   '#537952',
    //   '#446944',
    // ],
    academia: [
      '#f4f6f4',
      '#e8e9e8',
      '#cdd1cd',
      '#afb8af',
      '#95a395',
      '#859685',
      '#7c907b',
      '#393d32',
      '#393d32',
      '#26302a',
    ],
    wood: [
      '#faf2f0',
      '#ede2e0',
      '#ddc2ba',
      '#cfa093',
      '#c38370',
      '#bc705a',
      '#b9664f',
      '#a35640',
      '#391c14',
      '#391c14',
    ],
  },
  defaultGradient: {
    from: 'academia.6',
    to: 'academia.9',
    deg: 45,
  },
  fontFamily: ebGaramond.style.fontFamily,
  headings: { fontFamily: ebGaramond.style.fontFamily, fontWeight: '800' },
  scale: 1.1,
  defaultRadius: 'xs',
  components: {
    Text: Text.extend({
      defaultProps: {
        c: 'dark.0',
      },
    }),
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
    LoadingOverlay: LoadingOverlay.extend({
      defaultProps: {
        overlayProps: {
          radius: 'sm',
          blur: 3,
          color: '#1F1F1F',
        },
      },
    }),
    Divider: Divider.extend({
      defaultProps: {
        color: 'wood.7',
        size: 'xl',
      },
      styles: {
        root: {
          borderRadius: 25,
        },
      },
    }),
  },
})

export const cssVariableResolver: CSSVariablesResolver = () => ({
  variables: {
    '--mantine-header-height': rem(94),
    '--header-footer-color': 'var(--mantine-color-academia-filled)',
    '--header-footer-hover': 'var(--mantine-color-academia-filled-hover)',
  },
  light: {},
  dark: {},
})

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride)
export const colorScheme: 'dark' | 'light' = 'dark'
