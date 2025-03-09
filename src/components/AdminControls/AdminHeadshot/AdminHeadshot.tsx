'use client'

import {
  Button,
  FileButton,
  Group,
  LoadingOverlay,
  Stack,
  Title,
} from '@mantine/core'
import imageCompression from 'browser-image-compression'
import Image from 'next/image'
import { useRef, useState } from 'react'

import { useErrorDialog } from '~/hooks/useErrorDialog'
import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { generateNextImagePlaceholder } from '~/utils'
import { ACCEPTED_IMAGE_TYPES } from '~/utils/forms/FormConstants'
import uploadImagesToSanity, {
  ImageReference,
} from '~/utils/images/uploadImagesToSanity'

import DeleteWithConfirmation from '../../DeleteWithConfirmation/DeleteWithConfirmation'

interface IAdminHeadshot {
  artistId: string
  headshotRef?: ImageReference
}

const AdminHeadshot = ({ artistId, headshotRef }: IAdminHeadshot) => {
  const resetRef = useRef<() => void>(null)
  const [imageRef, setImageRef] = useState<ImageReference | null>(
    headshotRef || null,
  )
  const headshotImage = imageRef ? getImageFromRef(imageRef) : null
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { openErrorDialog } = useErrorDialog()

  const onImageChange = async (file: File | null) => {
    if (!file) return

    setIsSubmitting(true)

    const previousHeadshotId = headshotImage?._id

    let compressedFile: File | null = null
    try {
      compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 900,
        useWebWorker: true,
      })
    } catch (error) {
      openErrorDialog()
    }

    // upload image
    const imageReferences = await uploadImagesToSanity([compressedFile || file])

    if (
      imageReferences === 'GeneralError' ||
      imageReferences === 'SizeLimitError' ||
      imageReferences.length > 1
    ) {
      openErrorDialog()
      setIsSubmitting(false)
      return
    }

    // set artist reference to new image
    const response = await fetch('/api/sanity/artist', {
      method: 'PATCH',
      body: JSON.stringify({
        headshot: imageReferences[0],
        artistId: artistId,
      }),
    })

    if (response.ok) {
      const resJson = await response.json()
      setImageRef(resJson.headshot)

      if (previousHeadshotId) {
        // delete previous headshot in background
        fetch('/api/sanity/images', {
          method: 'DELETE',
          body: JSON.stringify({ imageIds: [previousHeadshotId] }),
        })
      }
    } else {
      openErrorDialog()
    }

    setIsSubmitting(false)
  }

  const onImageDelete = async (): Promise<void> => {
    if (!imageRef) return

    setIsSubmitting(true)

    // Clear headshot field from artist
    const response = await fetch('/api/sanity/artist', {
      method: 'PATCH',
      body: JSON.stringify({
        headshot: 'DELETE',
        artistId: artistId,
      }),
    })

    if (!response.ok) {
      openErrorDialog()
      return
    }

    // Delete previous headshot
    const deleteRes = await fetch('/api/sanity/images', {
      method: 'DELETE',
      body: JSON.stringify({ imageReferences: [imageRef] }),
    })

    if (deleteRes.ok) {
      setImageRef(null)
      resetRef.current?.()
    } else {
      openErrorDialog()
    }

    setIsSubmitting(false)
  }

  return (
    <Stack justify="center" align="center">
      <Title ta="center" order={2}>
        Update Headshot
      </Title>
      <Group
        p={0}
        m={0}
        pos="relative"
        style={{ height: '100%', width: '100%', minHeight: 300, maxWidth: 300 }}
      >
        <LoadingOverlay visible={isSubmitting} />
        <Image
          src={headshotImage?.url || '/user.svg'}
          alt="Artist headshot"
          fill
          sizes="100%"
          style={{
            objectFit: 'contain',
          }}
          placeholder={generateNextImagePlaceholder(300, 300)}
        />
      </Group>
      <Group w="100%" justify="space-around">
        <FileButton
          onChange={onImageChange}
          resetRef={resetRef}
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
        >
          {(props) => (
            <Button loading={isSubmitting} {...props}>
              Change
            </Button>
          )}
        </FileButton>
        <DeleteWithConfirmation
          isDeleting={isSubmitting}
          onDeleteConfirmed={onImageDelete}
          disabled={imageRef === null}
          confirmationMessage="Are you sure you want to remove your headshot image?"
        />
      </Group>
    </Stack>
  )
}

export default AdminHeadshot
