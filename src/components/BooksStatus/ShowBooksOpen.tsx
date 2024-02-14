'use client'

import { Alert, Dialog, Loader, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconInfoCircle } from '@tabler/icons-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useArtist } from '~/hooks/useArtist'
import { Artist } from '~/schemas/models/artist'
import { NavigationPages } from '~/utils/navigation'

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

  return (
    <>
      {showForm ? (
        <TattooForm onSuccess={onSuccess} onFailure={onFailure} />
      ) : (
        <Text
          component={Link}
          href={`${NavigationPages.BookingRequest}/${encodeURIComponent(
            artist._id,
          )}`}
        >
          {artist.name}:&nbsp;Click to book now
        </Text>
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
