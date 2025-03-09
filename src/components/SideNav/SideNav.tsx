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
  IconCameraUp,
  IconEdit,
  IconSettings,
} from '@tabler/icons-react'
import Link from 'next/link'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'

import { NavigationPages } from '~/utils/navigation'

const links = [
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
    page: NavigationPages.EmployeePortalSiteContent,
  },
]

const getUrl = (id: string, page: string): string => {
  return `${NavigationPages.EmployeePortal}/${encodeURIComponent(id)}${page}`
}

const SideNav = ({ session, id }: { session: Session; id: string }) => {
  const [opened, { close, toggle }] = useDisclosure(false)
  const mainLinks = links.map((link) => (
    <NavLink
      key={link.label}
      component={Link}
      onClick={toggle}
      href={getUrl(id, link.page)}
      label={link.label}
      leftSection={link.icon}
    />
  ))

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
