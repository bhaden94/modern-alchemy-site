'use client'

import { List } from '@mantine/core'
import Link from 'next/link'

const artists = ['artist1', 'artist2', 'artist3']

const ArtistList = () => {
  return (
    <List>
      {artists.map((artist) => (
        <Link key={artist} href={`/artists/${artist}`}>
          <List.Item>{artist}</List.Item>
        </Link>
      ))}
    </List>
  )
}

export default ArtistList
