'use client'

import { Alert, Dialog, Loader, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { PortableText } from '@portabletext/react'
import { IconInfoCircle } from '@tabler/icons-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useArtist } from '~/hooks/useArtist'
import { NavigationPages } from '~/utils/navigation'

import { PortableTextComponents } from '../PortableTextComponents'

const TattooForm = dynamic(
  () => import('~/components/BookingRequests/TattooForm'),
  {
    loading: () => (
      <div className="flex flex-col items-center">
        <Loader />
      </div>
    ),
  },
)

const icon = <IconInfoCircle />
const generalFailureMessage = 'Something went wrong. Please try to re-submit.'
const excessiveFailureMessage =
  'Looks like the site is having trouble. Please reach out to the artist directly for further assistance.'

const ShowBooksOpen = ({ showForm }: { showForm: boolean }) => {
  const router = useRouter()
  const { artist } = useArtist()
  const [opened, { open, close }] = useDisclosure(false)

  const [failuresCount, setFailuresCount] = useState(0)
  const [failureMessage, setFailureMessage] = useState(generalFailureMessage)

  const onSuccess = () => {
    close()
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
    open()
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

      <Dialog opened={opened} onClose={close} p={0}>
        <Alert
          icon={icon}
          variant="filled"
          color="red.9"
          title="Bummer!"
          withCloseButton
          onClose={close}
        >
          {failureMessage}
        </Alert>
      </Dialog>
    </>
  )
}

export default ShowBooksOpen
