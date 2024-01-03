'use client'

import { Burger, Container, Drawer, Group, List } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconFlask2 } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { NavigationPages, NavLinks } from '~/utils/navigation'

import classes from './Header.module.css'

const chooseActiveHeader = (pathname: string | null, link: string): boolean => {
  const path = pathname?.substring(1)
  if (path === '' && link === '/') return true
  // covers dynamic route like artists/name
  if (link !== '/' && path?.startsWith(link.substring(1))) return true
  return false
}

const Header = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [opened, { toggle, close }] = useDisclosure(false)

  const items = NavLinks.map(({ link, label }) => (
    <a
      key={label}
      href={link}
      className={classes.link}
      data-active={chooseActiveHeader(pathname, link) || undefined}
      onClick={(event) => {
        event.preventDefault()
        router.push(link)
        close()
      }}
    >
      {label}
    </a>
  ))

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Link href={NavigationPages.Home}>
          <IconFlask2 size={36} />
        </Link>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Drawer opened={opened} onClose={close}>
          <List className="list-none" hiddenFrom="xs">
            {items.map((item) => (
              <List.Item key={item.key} className="my-4">
                {item}
              </List.Item>
            ))}
          </List>
        </Drawer>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  )
}

export default Header
