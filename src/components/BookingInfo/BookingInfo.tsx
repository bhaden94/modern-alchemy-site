'use client'

import { PortableText } from '@portabletext/react'

import { Artist } from '~/schemas/models/artist'
import { BookingInfoPageContent } from '~/schemas/pages/bookingInfoPageContent'

import ArtistList from '../Artists/ArtistList/ArtistList'
import PageTitle from '../PageTitle/PageTitle'
import { PortableTextComponents } from '../PortableTextComponents/PortableTextComponents'

interface IBookingInfo {
  content: BookingInfoPageContent
  artists: Artist[]
}

const BookingInfo = ({ content, artists }: IBookingInfo) => {
  return (
    <>
      <PageTitle title={content.pageTitle} />
      {content.information && (
        <PortableText
          value={content.information}
          components={PortableTextComponents}
        />
      )}

      <ArtistList artists={artists} />
    </>
  )
}

export default BookingInfo
