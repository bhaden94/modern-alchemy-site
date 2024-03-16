'use client'

import { ActionIcon, Container, Group, rem, Text } from '@mantine/core'
import { IconBrandFacebook, IconBrandInstagram } from '@tabler/icons-react'
import Image from 'next/image'

import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { NavigationItem } from '~/schemas/pages/rootLayoutContent'
import { ImageReference } from '~/utils/images/uploadImagesToSanity'
import { ExtraNavLinks } from '~/utils/navigation'

import NavMenuDropdown from '../NavMenu/NavMenuDropdown'
import NavMenuLink from '../NavMenu/NavMenuLink'
import classes from './Footer.module.css'

interface IFooter {
  logo: ImageReference
  copyrightText?: string
  logoCaption?: string
  instagram?: string
  facebook?: string
  navItems?: NavigationItem[]
}

const Footer = (props: IFooter) => {
  const { logo, copyrightText, logoCaption, instagram, facebook, navItems } =
    props

  const navGroup = navItems?.map((navItem) => {
    return 'links' in navItem ? (
      <NavMenuDropdown key={navItem.label} navItem={navItem} />
    ) : (
      <NavMenuLink key={navItem.label} navItem={navItem} />
    )
  })

  const extraNavGroup = ExtraNavLinks.map((navItem) => {
    return <NavMenuLink key={navItem.label} navItem={navItem} />
  })

  return (
    <footer className={classes.footer}>
      <Container className="flex flex-col items-center sm:justify-between sm:flex-row">
        <div className="flex flex-col items-center sm:max-w-[200px] sm:items-start">
          <Image
            src={getImageFromRef(logo)?.url || ''}
            alt="Business logo"
            width={120}
            height={46}
          />
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
          {copyrightText?.replace(
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
              color="primary"
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
              color="primary"
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
