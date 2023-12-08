'use client'

import { Switch } from '@nextui-org/switch'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div>
      <p>The current theme is: {theme}</p>
      <Switch
        onValueChange={(isSelected) => setTheme(isSelected ? 'dark' : 'light')}
        isSelected={theme === 'dark'}
        aria-label="Theme switcher"
      />
    </div>
  )
}
