'use client'

import Link from 'next/link'

import { NavigationLink } from '~/utils/navigation'

import classes from './NavMenu.module.css'

interface INavMenuLink {
  navItem: NavigationLink
  isHeader?: boolean
  onLinkClick?: (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: string,
  ) => void
}

const NavMenuLink = ({
  navItem,
  isHeader = false,
  onLinkClick,
}: INavMenuLink) => {
  const linkClass = isHeader ? classes.linkHeader : classes.linkFooter

  return (
    <Link
      key={navItem.label}
      href={navItem.link}
      className={linkClass}
      onClick={(event) => onLinkClick && onLinkClick(event, navItem.link)}
    >
      {navItem.label}
    </Link>
  )
}

export default NavMenuLink
