'use client'

import { Switch } from '@mantine/core'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  // TODO: change to mantine theme
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div>
      <p>The current theme is: {theme}</p>
      <Switch
        size="lg"
        onLabel="Dark mode"
        offLabel="Light mode"
        onChange={(event) =>
          setTheme(event.currentTarget.checked ? 'dark' : 'light')
        }
        checked={theme === 'dark'}
        aria-label="Theme switcher"
      />
    </div>
  )
}
