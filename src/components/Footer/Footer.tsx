'use client'

import { ActionIcon, Container, Group, rem,Text } from '@mantine/core'
import { IconBrandFacebook,IconBrandInstagram } from '@tabler/icons-react'
import { IconPhoto } from '@tabler/icons-react'

import { ExtraNavLinks, NavLinks } from '~/utils/navigation'

import classes from './Footer.module.css'

const Footer = () => {
  const navGroup = NavLinks.map(({ label, link }) => {
    return (
      <Text<'a'> key={label} className={classes.link} component="a" href={link}>
        {label}
      </Text>
    )
  })

  const extraNavGroup = ExtraNavLinks.map(({ label, link }) => {
    return (
      <Text<'a'> key={label} className={classes.link} component="a" href={link}>
        {label}
      </Text>
    )
  })

  return (
    <footer className={classes.footer}>
      <Container className="flex flex-col items-center sm:justify-between sm:flex-row">
        <div className="flex flex-col items-center sm:max-w-[200px] sm:items-start">
          <IconPhoto size={28} />
          <Text size="xs" c="dimmed" className="mt-1 text-center sm:text-left">
            The best tattoo studio ever!
          </Text>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="hidden sm:flex sm:flex-wrap sm:gap-4">{navGroup}</div>
          <div className="flex flex-wrap gap-4">{extraNavGroup}</div>
        </div>
      </Container>
      <Container
        className={`flex flex-col justify-between items-center mt-4 py-4 sm:flex-row ${classes.afterFooter}`}
      >
        <Text c="dimmed" size="sm">
          {/* TODO: change copywrite */}© 2020 mantine.dev. All rights
          reserved.
        </Text>

        <Group
          gap={0}
          className="mt-4 sm:mt-0"
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon
            component={'a'}
            target="_blank"
            href="https://www.instagram.com"
            size="lg"
            color="gray"
            variant="subtle"
          >
            <IconBrandInstagram
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon
            component={'a'}
            target="_blank"
            href="https://www.facebook.com"
            size="lg"
            color="gray"
            variant="subtle"
          >
            <IconBrandFacebook
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  )
}

export default Footer
