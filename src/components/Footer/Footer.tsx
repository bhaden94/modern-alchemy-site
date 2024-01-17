'use client'

import { ActionIcon, Container, Group, rem, Text } from '@mantine/core'
import { IconBrandFacebook, IconBrandInstagram } from '@tabler/icons-react'
import Image from 'next/image'
import { ImageAsset } from 'sanity'

import { ExtraNavLinks, NavLinks } from '~/utils/navigation'

import classes from './Footer.module.css'

interface IFooter {
  logo: ImageAsset
  copywriteText: string
  logoCaption?: string
  instagram?: string
  facebook?: string
}

const Footer = (props: IFooter) => {
  const { logo, copywriteText, logoCaption, instagram, facebook } = props

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
          <Image src={logo.url} alt="Business logo" width={100} height={40} />
          <Text size="xs" className="mt-1 text-center sm:text-left">
            {logoCaption || ''}
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
        <Text size="sm" ta="center">
          ©&nbsp;
          {copywriteText.replace(
            '{currentYear}',
            new Date().getFullYear().toString(),
          )}
        </Text>

        <Group
          gap={0}
          className="mt-4 sm:mt-0"
          justify="flex-end"
          wrap="nowrap"
        >
          {instagram && (
            <ActionIcon
              component={'a'}
              target="_blank"
              href={instagram}
              size="lg"
              color="gray"
              variant="subtle"
            >
              <IconBrandInstagram
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
          )}
          {facebook && (
            <ActionIcon
              component={'a'}
              target="_blank"
              href={facebook}
              size="lg"
              color="gray"
              variant="subtle"
            >
              <IconBrandFacebook
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
          )}
        </Group>
      </Container>
    </footer>
  )
}

export default Footer
