import { Button, Container, Overlay, Text, Title } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'

import { Base64heroImage } from '~/utils'
import { NavigationPages } from '~/utils/navigation'

import classes from './Hero.module.css'

interface IHero {
  title: string
  description?: string
  buttonText?: string
  buttonLink?: string
}

const Hero = ({ title, description, buttonText, buttonLink }: IHero) => {
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

        <Button
          component={Link}
          href={buttonLink || NavigationPages.Artists}
          visibleFrom="xs"
          variant="gradient"
          size="xl"
          className={classes.control}
        >
          {buttonText || 'View our artists'}
        </Button>
        <Button
          component={Link}
          href={buttonLink || NavigationPages.Artists}
          hiddenFrom="xs"
          variant="gradient"
          size="md"
          className={classes.control}
        >
          {buttonText || 'View our artists'}
        </Button>
      </Container>
    </div>
  )
}

export default Hero
