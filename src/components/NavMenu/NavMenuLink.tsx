'use client'

import Link from 'next/link'

import { NavigationLink } from '~/schemas/pages/rootLayoutContent'

import classes from './NavMenu.module.css'

interface INavMenuLink {
  navItem: NavigationLink
  isHeader?: boolean
  prefetch?: boolean | undefined
  onLinkClick?: (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: string,
  ) => void
}

const NavMenuLink = ({
  navItem,
  isHeader = false,
  prefetch = undefined,
  onLinkClick,
}: INavMenuLink) => {
  const linkClass = isHeader ? classes.linkHeader : classes.linkFooter

  return (
    <Link
      key={navItem.label}
      href={navItem.link}
      className={linkClass}
      prefetch={prefetch}
      onClick={(event) => onLinkClick && onLinkClick(event, navItem.link)}
    >
      {navItem.label}
    </Link>
  )
}

export default NavMenuLink
