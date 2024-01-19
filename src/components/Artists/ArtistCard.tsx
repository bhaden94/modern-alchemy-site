'use client'

import { Badge, Button, Card, Group, Text } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'

import { Artist } from '~/schemas/models/artist'
import { generateNextImagePlaceholder } from '~/utils'
import { NavigationPages } from '~/utils/navigation'

import ArtistCardBookingRequest from './ArtistCardBookingRequest'

interface IArtistCard {
  artist: Artist
  showPortfolioLink?: boolean
}

const ArtistCard = ({ artist, showPortfolioLink }: IArtistCard) => {
  return (
    <Card shadow="sm" key={artist.name} className="max-w-[300px]">
      <Card.Section mb={6}>
        <Image
          src={artist.headshot?.asset.url || '/user.svg'}
          alt="Artist headshot"
          width={300}
          height={300}
          placeholder={generateNextImagePlaceholder(300, 250)}
        />
      </Card.Section>

      <Group py={6}>
        <Text size="xl" fw={700}>
          {artist.name}
        </Text>
      </Group>

      {artist.styles?.length > 0 ? <Text>Styles</Text> : undefined}
      <Group py={6}>
        {artist.styles?.map((style) => (
          <Badge variant="light" key={style}>
            {style}
          </Badge>
        ))}
      </Group>

      {showPortfolioLink ? (
        <Group justify="center" mt="auto" pb={6} pt={18}>
          <Link
            href={`${NavigationPages.Artists}/${encodeURIComponent(
              artist._id,
            )}`}
          >
            <Button radius="sm">View Portfolio</Button>
          </Link>
        </Group>
      ) : (
        <ArtistCardBookingRequest artist={artist} />
      )}
    </Card>
  )
}

export default ArtistCard
