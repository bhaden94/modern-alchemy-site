/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  plugins: [],
  theme: {
    screens: {
      xs: '576px',
      sm: '768px',
      md: '992px',
      lg: '1200px',
      xl: '1408px',
    },
  },
} satisfies Config
