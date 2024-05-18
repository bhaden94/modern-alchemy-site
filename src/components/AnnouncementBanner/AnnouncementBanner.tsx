'use client'

import { Group } from '@mantine/core'
import Link from 'next/link'

import { NavigationPages } from '~/utils/navigation'

import classes from './AnnouncementBanner.module.css'

interface IAnnouncementBanner {
  title: string
}

const AnnouncementBanner = ({ title }: IAnnouncementBanner) => {
  return (
    <Group className={classes.banner}>
      <Link href={NavigationPages.Announcement} className={classes.link}>
        {title}
      </Link>
    </Group>
  )
}

export default AnnouncementBanner
