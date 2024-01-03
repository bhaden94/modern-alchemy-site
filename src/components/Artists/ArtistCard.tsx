'use client'

import { Badge, Button, Card, Group, Text } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'

import { Artist } from '~/types/SanitySchemaTypes'
import { generateNextImagePlaceholder } from '~/utils'
import { NavigationPages } from '~/utils/navigation'

interface IArtistCard {
  artist: Artist
  showPortfolioLink?: boolean
}

const ArtistCard = ({ artist, showPortfolioLink }: IArtistCard) => {
  const BookingRequestButton = () => {
    if (artist.booksOpen) {
      return (
        <Group justify="center" mt="auto" pb={6} pt={18}>
          <Link
            href={`${NavigationPages.BookingRequest}/${encodeURIComponent(
              artist.name,
            )}`}
          >
            <Button radius="sm">submit booking request</Button>
          </Link>
        </Group>
      )
    }

    return undefined
  }

  return (
    <Card shadow="sm" key={artist.name} className="max-w-[300px]">
      <Card.Section mb={6}>
        <Image
          src={artist.headshot?.asset.url || '/user.svg'}
          alt="Artist headshot"
          width={300}
          height={250}
          placeholder={generateNextImagePlaceholder(300, 250)}
        />
      </Card.Section>

      <Group py={6}>
        <Text size="xl">{artist.name}</Text>
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
              artist.name,
            )}`}
          >
            <Button radius="sm">View Portfolio</Button>
          </Link>
        </Group>
      ) : (
        <BookingRequestButton />
      )}
    </Card>
  )
}

export default ArtistCard
