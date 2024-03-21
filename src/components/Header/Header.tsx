'use client'

import { Burger, Container, Drawer, Group, List } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { NavigationItem } from '~/schemas/pages/rootLayoutContent'
import { ImageReference } from '~/utils/images/uploadImagesToSanity'
import { NavigationPages } from '~/utils/navigation'

import NavMenuDropdown from '../NavMenu/NavMenuDropdown'
import NavMenuLink from '../NavMenu/NavMenuLink'
import classes from './Header.module.css'

interface IHeader {
  logo: ImageReference
  navItems?: NavigationItem[]
}

const Header = ({ logo, navItems }: IHeader) => {
  const router = useRouter()
  const [opened, { toggle, close }] = useDisclosure(false)
  const onLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: string,
  ) => {
    event.preventDefault()
    router.push(link)
    close()
  }

  const items = navItems?.map((navItem) => {
    return 'links' in navItem ? (
      <NavMenuDropdown
        key={navItem.label}
        navItem={navItem}
        onLinkClick={onLinkClick}
        isHeader
      />
    ) : (
      <NavMenuLink
        key={navItem.label}
        navItem={navItem}
        onLinkClick={onLinkClick}
        isHeader
      />
    )
  })

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Link href={NavigationPages.Home} className="flex">
          <Image
            src={getImageFromRef(logo)?.url || ''}
            alt="Business logo"
            width={220}
            height={84}
          />
        </Link>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Drawer opened={opened} onClose={close} position="right">
          <List className="list-none" hiddenFrom="xs">
            {items?.map((item) => (
              <List.Item key={item.key} className="my-4">
                {item}
              </List.Item>
            ))}
          </List>
        </Drawer>
        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          hiddenFrom="xs"
          size="md"
        />
      </Container>
    </header>
  )
}

export default Header
