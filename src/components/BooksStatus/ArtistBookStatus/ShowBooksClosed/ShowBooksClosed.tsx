'use client'

import { Text } from '@mantine/core'
import { PortableText } from '@portabletext/react'

import { useArtist } from '~/hooks/useArtist'

import { PortableTextComponents } from '../../../PortableTextComponents/PortableTextComponents'
import BooksOpenAt from './BooksOpenAt/BooksOpenAt'

const ShowBooksClosed = () => {
  const { artist } = useArtist()

  return (
    <div>
      <Text span>Books will open on&nbsp;</Text>
      <BooksOpenAt date={artist.booksOpenAt} />
      {artist.booksClosedMessage ? (
        <PortableText
          value={artist.booksClosedMessage}
          components={PortableTextComponents}
        />
      ) : undefined}
    </div>
  )
}

export default ShowBooksClosed
