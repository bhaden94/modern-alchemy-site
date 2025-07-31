import { Button, Container, Group, Overlay, Text, Title } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'

import { MailingListContent } from '~/schemas/models/mailingList'
import { Base64heroImage } from '~/utils'
import { NavigationPages } from '~/utils/navigation'

import classes from './Hero.module.css'
import MailingListFormLink from './MailingListFormLink/MailingListFormLink'

interface IHero {
  title: string
  description?: string
  buttonText?: string
  buttonLink?: string
  mailingListContent?: MailingListContent
}

const Hero = ({
  title,
  description,
  buttonText,
  buttonLink,
  mailingListContent,
}: IHero) => {
  return (
    <div className={classes.hero}>
      <Overlay
        gradient="linear-gradient(to bottom, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.4) 100%)"
        zIndex={1}
      />
      <Image
        className={classes.heroImage}
        src="/tattoo-shop.jpg"
        alt="Picture of shop"
        fill
        sizes="100vw"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
        placeholder="blur"
        blurDataURL={Base64heroImage}
      />
      <Container className={classes.container} size="md">
        <Title className={classes.title}>{title}</Title>
        {description ? (
          <Text className={classes.description} size="xl" mt="xl">
            {description}
          </Text>
        ) : undefined}

        <Group className={classes.control}>
          <Button
            component={Link}
            href={buttonLink || NavigationPages.Artists}
            visibleFrom="xs"
            variant="gradient"
            size="xl"
          >
            {buttonText || 'View our artists'}
          </Button>
          <Button
            component={Link}
            href={buttonLink || NavigationPages.Artists}
            hiddenFrom="xs"
            variant="gradient"
            size="md"
            fullWidth
          >
            {buttonText || 'View our artists'}
          </Button>
          <MailingListFormLink content={mailingListContent} />
        </Group>
      </Container>
    </div>
  )
}

export default Hero
