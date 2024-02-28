'use client'

import { Box, Divider, Grid, rem, Stack, Title } from '@mantine/core'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'

import { AboutContent } from '~/schemas/pages/rootPageContent'
import { generateNextImagePlaceholder } from '~/utils'

import { PortableTextComponents } from '../../PortableTextComponents'

// TODO: see if we can add scroll in animations
// We can possibly use 'use-intersection' hook and transitions together to achieve this
const AboutItem = ({ item, index }: { item: AboutContent; index: number }) => {
  // text first in even number indexes
  const textOrder: number = index % 2 === 0 ? 1 : 2
  // images first in odd number indexes
  const imageOrder: number = index % 2 === 0 ? 2 : 1

  const AboutText = () => {
    return (
      <Stack align="center" justify="center" gap="xs">
        <Title order={2} size="h1" mb="1rem">
          {item.heading}
        </Title>
        <Divider w="75%" />
        <PortableText value={item.text} components={PortableTextComponents} />
      </Stack>
    )
  }

  const AboutImage = () => {
    if (!item.image) return undefined

    return (
      <Image
        src={item.image.asset.url}
        fill={true}
        style={{
          objectFit: 'contain',
          objectPosition: 'center',
        }}
        alt="about section image"
        placeholder={generateNextImagePlaceholder(
          item.image.asset.metadata.dimensions.width,
          item.image.asset.metadata.dimensions.height,
          'sm',
        )}
      />
    )
  }

  return (
    <Grid
      justify="space-between"
      align="stretch"
      mt={{ base: 25, md: 50 }}
      mb={{ base: 50, sm: 75, md: 100 }}
    >
      {item.image ? (
        <>
          <Grid.Col
            ta="center"
            order={textOrder}
            span={{ xs: 12, sm: 6 }}
            px={{ xs: 0, sm: 35, md: 50, lg: 65 }}
          >
            <AboutText />
          </Grid.Col>
          <Grid.Col
            visibleFrom="sm"
            ta="center"
            pos="relative"
            order={imageOrder}
            span={6}
            mih={{ xs: rem(150), md: rem(250), lg: rem(350) }}
          >
            <AboutImage />
          </Grid.Col>
        </>
      ) : (
        <Grid.Col ta="center">
          <Box px={{ xs: 0, sm: 35, md: 150, lg: 275 }}>
            <AboutText />
          </Box>
        </Grid.Col>
      )}
    </Grid>
  )
}

export default AboutItem
