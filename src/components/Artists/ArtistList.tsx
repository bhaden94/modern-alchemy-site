'use client'

import { Anchor, Badge, Button, Card, Group, Text } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'

import { Artist } from '~/types/SanitySchemaTypes'

const ArtistList = ({ artists }: { artists: Artist[] }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {artists?.map((artist) => (
        <Card shadow="sm" key={artist.name} className="max-w-[300px]">
          <Card.Section mb={6}>
            <Image
              src={artist.headshot?.asset.url || '/user.svg'}
              alt="Artist headshot"
              width={300}
              height={250}
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

          <Group justify="center" mt="auto" pb={6} pt={18}>
            <Link href={`/artists/${artist.name}`}>
              <Button radius="sm">View Portfolio</Button>
            </Link>
          </Group>
        </Card>
      ))}
    </div>
  )
}

export default ArtistList
