'use client'

import { Center, Menu, Text } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import Link from 'next/link'

import { NestedNavigationLink } from '~/schemas/pages/rootLayoutContent'

import classes from './NavMenu.module.css'

interface INavMenuDropdown {
  navItem: NestedNavigationLink
  isHeader?: boolean
  onLinkClick?: (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: string,
  ) => void
}

const NavMenuDropdown = ({
  navItem,
  isHeader = false,
  onLinkClick,
}: INavMenuDropdown) => {
  const linkLabelParentClass = isHeader
    ? classes.linkLabelParentHeader
    : classes.linkLabelParentFooter
  const linkClass = isHeader ? classes.linkHeader : classes.linkFooter
  const linkLabelClass = isHeader ? classes.linkLabel : classes.linkFooter

  return (
    <Menu
      trigger="click-hover"
      classNames={{ dropdown: classes.dropdown }}
      transitionProps={{ exitDuration: 0 }}
    >
      <Menu.Target>
        <Center component={Link} href="#" className={linkLabelParentClass}>
          <Text className={linkLabelClass}>{navItem.label}</Text>
          <IconChevronDown size="1rem" stroke={1.5} />
        </Center>
      </Menu.Target>
      <Menu.Dropdown>
        {navItem.links.map(({ label, link }) => (
          <Menu.Item
            key={label}
            className={linkClass}
            component={Link}
            href={link}
            onClick={(event) => onLinkClick && onLinkClick(event, link)}
          >
            {label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}

export default NavMenuDropdown
