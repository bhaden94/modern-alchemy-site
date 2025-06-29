'use client'

import { Loader } from '@mantine/core'
import { PortableText } from '@portabletext/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useArtist } from '~/hooks/useArtist'
import { useErrorDialog } from '~/hooks/useErrorDialog'
import { NavigationPages } from '~/utils/navigation'

import { PortableTextComponents } from '../../../PortableTextComponents/PortableTextComponents'

const BookingRequestLink = dynamic(
  () => import('./BookingRequestLink/BookingRequestLink'),
  {
    loading: () => (
      <div className="flex flex-col items-center">
        <Loader />
      </div>
    ),
  },
)

const EmbeddedScriptWidget = dynamic(
  () => import('./EmbeddedScriptWidget/EmbeddedScriptWidget'),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center">
        <Loader />
      </div>
    ),
  },
)

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

const ShowBooksOpen = () => {
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

  const TattooFormComponent = () => {
    return (
      <>
        {artist.bookingInstructions ? (
          <PortableText
            value={artist.bookingInstructions}
            components={PortableTextComponents}
          />
        ) : undefined}
        <TattooForm onSuccess={onSuccess} onFailure={onFailure} />
      </>
    )
  }

  const RenderComponent = () => {
    if (!!artist.externalBookingLink) {
      return <BookingRequestLink />
    }

    if (!!artist.embeddedWidget) {
      return <EmbeddedScriptWidget />
    }

    return <TattooFormComponent />
  }

  return <RenderComponent />
}

export default ShowBooksOpen
