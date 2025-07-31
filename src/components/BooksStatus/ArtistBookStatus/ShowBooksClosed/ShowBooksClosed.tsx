'use client'

import { Text } from '@mantine/core'
import { PortableText } from '@portabletext/react'

import MailingList from '~/components/MailingList/MailingList'
import { useArtist } from '~/hooks/useArtist'

import { PortableTextComponents } from '../../../PortableTextComponents/PortableTextComponents'
import BooksOpenAt from './BooksOpenAt/BooksOpenAt'
import classes from './ShowBooksClosed.module.css'

const ShowBooksClosed = () => {
  const { artist, mailingList } = useArtist()

  return (
    <>
      <div className={classes.booksOpenAt}>
        <Text span>
          Books will open on&nbsp;
          <BooksOpenAt date={artist.booksOpenAt} />
        </Text>

        {artist.booksClosedMessage ? (
          <PortableText
            value={artist.booksClosedMessage}
            components={PortableTextComponents}
          />
        ) : undefined}
      </div>

      <div className={classes.mailingList}>
        <MailingList content={mailingList} />
      </div>
    </>
  )
}

export default ShowBooksClosed
