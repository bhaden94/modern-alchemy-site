'use client'

import { Loader, Text } from '@mantine/core'
import { PortableText } from '@portabletext/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useArtist } from '~/hooks/useArtist'
import { useErrorDialog } from '~/hooks/useErrorDialog'
import { NavigationPages } from '~/utils/navigation'

import { PortableTextComponents } from '../../../PortableTextComponents/PortableTextComponents'

const TattooForm = dynamic(
  () =>
    import(
      '~/components/BooksStatus/ArtistBookStatus/ShowBooksOpen/TattooForm/TattooForm'
    ),
  {
    loading: () => (
      <div className="flex flex-col items-center">
        <Loader />
      </div>
    ),
  },
)

const generalFailureMessage = 'Something went wrong. Please try to re-submit.'
const excessiveFailureMessage =
  'Looks like the site is having trouble. Please reach out to the artist directly for further assistance.'

const ShowBooksOpen = ({ showForm }: { showForm: boolean }) => {
  const router = useRouter()
  const { artist } = useArtist()
  const { openErrorDialog, closeErrorDialog } = useErrorDialog()

  const [failuresCount, setFailuresCount] = useState(0)
  const [failureMessage, setFailureMessage] = useState(generalFailureMessage)

  const onSuccess = () => {
    closeErrorDialog()
    router.push(
      `${NavigationPages.BookingRequestSuccess}?name=${encodeURIComponent(
        artist.name,
      )}`,
    )
  }

  const onFailure = (message?: string) => {
    message
      ? setFailureMessage(message)
      : setFailureMessage(
          failuresCount < 2 ? generalFailureMessage : excessiveFailureMessage,
        )

    setFailuresCount(failuresCount + 1)
    openErrorDialog(failureMessage)
  }

  const BookingRequestLink = () => {
    if (artist.externalBookingLink) {
      return (
        <Text
          component={Link}
          href={artist.externalBookingLink}
          target="_blank"
          display="block"
        >
          {artist.name}:&nbsp;Go to booking site
        </Text>
      )
    }

    return (
      <Text
        component={Link}
        href={`${NavigationPages.BookingRequest}/${encodeURIComponent(
          artist._id,
        )}`}
        display="block"
      >
        {artist.name}:&nbsp;Click to book now
      </Text>
    )
  }

  return (
    <>
      {showForm ? (
        <>
          {artist.bookingInstructions ? (
            <PortableText
              value={artist.bookingInstructions}
              components={PortableTextComponents}
            />
          ) : undefined}
          <TattooForm onSuccess={onSuccess} onFailure={onFailure} />
        </>
      ) : (
        <BookingRequestLink />
      )}
    </>
  )
}

export default ShowBooksOpen
