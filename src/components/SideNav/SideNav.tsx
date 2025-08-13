'use client'

import {
  ActionIcon,
  Box,
  Button,
  Drawer,
  NavLink,
  Stack,
  Text,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconArrowBadgeRight,
  IconBook,
  IconBriefcase,
  IconCameraUp,
  IconEdit,
  IconSettings,
  IconSpeakerphone,
} from '@tabler/icons-react'
import Link from 'next/link'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'

import { AuthorizedRoles } from '~/lib/next-auth/auth.utils'
import { NavigationPages } from '~/utils/navigation'

interface BaseLink {
  label: string
  requiredRoles?: AuthorizedRoles[]
}

interface SimpleLink extends BaseLink {
  icon: React.ReactNode
  page: NavigationPages
  children?: never
}

interface NestedLink extends BaseLink {
  icon: React.ReactNode
  children: SimpleLink[]
  page?: never
}

type LinkItem = SimpleLink | NestedLink

const links: LinkItem[] = [
  {
    icon: <IconSettings stroke={1.5} />,
    label: 'Form/Books Settings',
    page: NavigationPages.EmployeePortalFormSettings,
  },
  {
    icon: <IconCameraUp stroke={1.5} />,
    label: 'Portfolio Settings',
    page: NavigationPages.EmployeePortalPortfolioSettings,
  },
  {
    icon: <IconBook stroke={1.5} />,
    label: 'Bookings',
    page: NavigationPages.EmployeePortalBookings,
  },
  {
    icon: <IconEdit stroke={1.5} />,
    label: 'Site Content',
    children: [
      {
        icon: <IconSpeakerphone stroke={1.5} />,
        label: 'Announcements',
        page: NavigationPages.EmployeePortalSiteContentAnnouncement,
        requiredRoles: ['Owner'],
      },
      {
        icon: <IconBriefcase stroke={1.5} />,
        label: 'Employment',
        page: NavigationPages.EmployeePortalSiteContentEmployment,
        requiredRoles: ['Owner'],
      },
    ],
  },
]

const getUrl = (id: string, page: string): string => {
  return `${NavigationPages.EmployeePortal}/${encodeURIComponent(id)}${page}`
}

const hasRequiredRole = (
  requiredRoles: AuthorizedRoles[] | undefined,
  userRole: AuthorizedRoles | null | undefined,
): boolean => {
  if (!requiredRoles) return true
  if (!userRole) return false
  return requiredRoles.includes(userRole)
}

const renderNavLink = (
  link: LinkItem,
  session: Session,
  id: string,
  onClose: () => void,
  isTopLevel: boolean = true,
): React.ReactNode | null => {
  if (!hasRequiredRole(link.requiredRoles, session.user?.role)) {
    return null
  }

  // Handle nested links
  if ('children' in link && link.children) {
    // Filter children based on their individual role requirements
    const visibleChildren = link.children
      .map((child) => renderNavLink(child, session, id, onClose, false))
      .filter(Boolean)

    // If no children are visible, don't render the parent
    if (visibleChildren.length === 0) return null

    return (
      <NavLink
        href="#required-for-focus"
        key={link.label}
        label={link.label}
        leftSection={isTopLevel ? link.icon : undefined} // Only show icon if top-level
        defaultOpened
      >
        {visibleChildren}
      </NavLink>
    )
  }

  // Handle simple links
  if ('page' in link && link.page) {
    return (
      <NavLink
        key={link.label}
        component={Link}
        onClick={onClose}
        href={getUrl(id, link.page)}
        label={link.label}
        leftSection={isTopLevel ? link.icon : undefined} // Only show icon if top-level
      />
    )
  }

  return null
}

const SideNav = ({ session, id }: { session: Session; id: string }) => {
  const [opened, { close, toggle }] = useDisclosure(false)

  const mainLinks = links
    .map((link) => renderNavLink(link, session, id, close, true))
    .filter(Boolean)

  const DrawerTitle = () => (
    <>
      <Text>{session.user?.name}</Text>
      <Text c="dimmed">{session.user?.email}</Text>
    </>
  )

  return (
    <>
      <Drawer opened={opened} onClose={close} title={<DrawerTitle />}>
        <Stack gap="xl">
          <Box>{mainLinks}</Box>
          <Button
            mt="auto"
            variant="outline"
            onClick={() => signOut({ callbackUrl: NavigationPages.Home })}
          >
            Sign Out
          </Button>
        </Stack>
      </Drawer>
      <ActionIcon
        onClick={toggle}
        className="rounded-r-full rounded-l-none z-[155]"
        variant="filled"
        aria-label="Settings"
        size="xl"
        pos="fixed"
      >
        <IconArrowBadgeRight
          size={36}
          stroke={1.5}
          color="var(--mantine-color-text)"
        />
      </ActionIcon>
    </>
  )
}

export default SideNav
