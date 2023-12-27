'use client'

import { List } from '@mantine/core'
import Link from 'next/link'

import { Artist } from '~/types/SanitySchemaTypes'

const ArtistList = ({ artists }: { artists: Artist[] }) => {
  return (
    <List>
      {artists.map((artist) => (
        <Link key={artist.name} href={`/artists/${artist.name}`}>
          <List.Item>{artist.name}</List.Item>
        </Link>
      ))}
    </List>
  )
}

export default ArtistList
