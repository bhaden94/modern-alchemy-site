'use client'

import { Anchor, Badge, Button, Card, Group, Text } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'

import { Artist } from '~/schemas/models/artist'
import { generateNextImagePlaceholder } from '~/utils'
import { NavigationPages } from '~/utils/navigation'

interface IArtistCard {
  artist: Artist
  showPortfolioLink?: boolean
}

const ArtistCard = ({ artist, showPortfolioLink }: IArtistCard) => {
  const CardButton = () => {
    if (showPortfolioLink) {
      return (
        <Button
          component={Link}
          href={`${NavigationPages.Artists}/${encodeURIComponent(artist._id)}`}
          radius="sm"
        >
          View Portfolio
        </Button>
      )
    }

    if (artist.externalBookingLink) {
      return (
        <Button
          component={Link}
          target="_blank"
          href={artist.externalBookingLink}
          radius="sm"
        >
          Go to booking site
        </Button>
      )
    }

    return (
      <Button
        component={Link}
        href={`${NavigationPages.BookingRequest}/${encodeURIComponent(
          artist._id,
        )}`}
        radius="sm"
        fz="xs"
      >
        submit booking request
      </Button>
    )
  }

  return (
    <Card shadow="sm" key={artist.name} className="max-w-[300px]">
      <Card.Section mb={6}>
        <Image
          src={artist.headshot?.asset.url || '/user.svg'}
          alt="Artist headshot"
          width={300}
          height={300}
          placeholder={generateNextImagePlaceholder(300, 300)}
        />
      </Card.Section>

      <Group py={6}>
        <Text size="xl" fw={700}>
          {artist.name}
        </Text>
      </Group>

      {artist.socials && artist.socials.length > 0 ? (
        <Text>Socials</Text>
      ) : undefined}
      <Group py={6}>
        {artist.socials?.map((social) => (
          <Anchor
            component={Link}
            key={social.label}
            href={social.link}
            underline="hover"
            target="_blank"
            c="primary"
          >
            {social.label}
          </Anchor>
        ))}
      </Group>

      {artist.styles && artist.styles.length > 0 ? (
        <Text>Styles</Text>
      ) : undefined}
      <Group py={6}>
        {artist.styles?.map((style) => (
          <Badge variant="light" key={style}>
            {style}
          </Badge>
        ))}
      </Group>

      <Group justify="center" mt="auto" pb={6} pt={18}>
        <CardButton />
      </Group>
    </Card>
  )
}

export default ArtistCard
