'use client'

import { Loader, Text } from '@mantine/core'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

  const onSuccess = () => {
    router.push(
      `${NavigationPages.BookingRequestSuccess}?name=${encodeURIComponent(
        artistName,
      )}`,
    )
  }

  const onFailure = () => {
    // Instead of redirecting, maybe we just show an alert so the client can attempt to submit again
    // After 2 retries we could show a dialog about reaching out to the artist for failures.
    console.error('There was an error submitting the request')
  }

  if (showForm) {
    return (
      <TattooForm
        artistId={artistId}
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
    )
  }

  return (
    <Link
      href={`${NavigationPages.BookingRequest}/${encodeURIComponent(artistId)}`}
      passHref
    >
      <Text component="a">{artistName}:&nbsp;Click to book now</Text>
    </Link>
  )
}

export default ShowBooksOpen
