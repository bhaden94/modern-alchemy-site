'use client'

import { Alert, Dialog, Loader, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconInfoCircle } from '@tabler/icons-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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

const ShowBooksOpen = ({
  showForm,
  artistId,
  artistName,
}: {
  showForm: boolean
  artistId: string
  artistName: string
}) => {
  const router = useRouter()
  const [failuresCount, setFailuresCount] = useState(0)
  const [failureMessage, setFailureMessage] = useState(generalFailureMessage)
  const [opened, { open, close }] = useDisclosure(false)

  const onSuccess = () => {
    close()
    router.push(
      `${NavigationPages.BookingRequestSuccess}?name=${encodeURIComponent(
        artistName,
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
        <TattooForm
          artistId={artistId}
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      ) : (
        <Text
          component={Link}
          href={`${NavigationPages.BookingRequest}/${encodeURIComponent(
            artistId,
          )}`}
        >
          {artistName}:&nbsp;Click to book now
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
