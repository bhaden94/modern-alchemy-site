'use client'

import { Text } from '@mantine/core'
import { PortableText } from '@portabletext/react'

import ArtistBooksStatus from '~/components/BooksStatus/ArtistBooksStatus'
import { Artist, BookingInfoPageContent } from '~/types/SanitySchemaTypes'

import BookStatuses from '../BooksStatus/BookStatuses'
import PageTitle from '../PageTitle/PageTitle'
import { PortableTextComponents } from '../PortableTextComponents'

interface IBookingInfo {
  content: BookingInfoPageContent
  artists: Artist[]
}

const BookingInfo = ({ content, artists }: IBookingInfo) => {
  return (
    <>
      <PageTitle title={content.pageTitle} />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <PortableText
            value={content.information}
            components={PortableTextComponents}
          />
        </div>
        <div className="md:col-span-2">
          <Text size="xl" mb="sm">
            Book Statuses
          </Text>
          <BookStatuses artists={artists} />
          {/* {artists.map((artist) => (
            <BooksStatus key={artist.name} name={artist.name} id={artist._id} />
          ))} */}
        </div>
      </div>
    </>
  )
}

export default BookingInfo
