import {
  Button,
  createTheme,
  DEFAULT_THEME,
  Input,
  Loader,
  mergeMantineTheme,
} from '@mantine/core'
import { Open_Sans,Raleway } from 'next/font/google'

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
  colors: {
    secondary: [
      '#F3F2FF',
      '#C1C2FF',
      '#8F97FB',
      '#5C6FF3',
      '#2B4DE3',
      '#0E36B4',
      '#032A85',
      '#001F55',
      '#001026',
      '#001026',
    ],
    primary: [
      '#D0DBD0',
      '#B4C6B4',
      '#A1B8A2',
      // other
      '#325433',
      '#6fa971',
      '#2C492C',
      '#253E25',
      // background colors
      '#142214',
      '#0D160E',
      '#070B07',
    ],
    // dark: [
    //   '#C9C9C9', // primary text color
    //   '#000000', // secondary text? (need to find out)
    //   '#828282', // --mantine-color-dimmed (currently affects icon and secondary text in dropzone)
    //   '#828282', // placeholder text
    //   '#424242', // border color on inputs
    //   '#3B3B3B', // hover on dropbox (hover in general?)
    //   '#002D03', // input background
    //   '#001E02', // page background
    //   '#1F1F1F', // need to find out
    //   '#141414', // need to find out
    // ],
  },
})

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride)
