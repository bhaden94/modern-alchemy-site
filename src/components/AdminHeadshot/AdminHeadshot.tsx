'use client'

import {
  Alert,
  Box,
  Button,
  Dialog,
  FileButton,
  Group,
  LoadingOverlay,
  Stack,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconInfoCircle } from '@tabler/icons-react'
import imageCompression from 'browser-image-compression'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { ImageAsset } from 'sanity'

import { urlForImage } from '~/lib/sanity/sanity.image'
import { generateNextImagePlaceholder } from '~/utils'
import { ACCEPTED_IMAGE_TYPES } from '~/utils/forms/FormConstants'
import uploadImagesToSanity from '~/utils/images/uploadImagesToSanity'

// TODO: Show loading overlay on image when changing.
// TODO: Show errors on page instead of just logging.

type ImageReference = {
  _key: string
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

interface IAdminHeadshot {
  artistId: string
  headshot?: { asset: ImageAsset }
}

const icon = <IconInfoCircle />
const generalFailureMessage = 'Something went wrong. Please try to re-submit.'
const AdminHeadshot = ({ artistId, headshot }: IAdminHeadshot) => {
  const resetRef = useRef<() => void>(null)
  const [imageRef, setImageRef] = useState<ImageReference | null>(null)
  const imageRefUrl = imageRef
    ? urlForImage(imageRef)?.size(300, 300).url()
    : null
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [hasUpdateHeadshot, setHasUpdatedHeadshot] = useState(false)
  const [opened, { open, close }] = useDisclosure(false)

  const onImageChange = async (file: File | null) => {
    if (!file) return

    setIsSubmitting(true)

    const previousHeadshotId = imageRef ? imageRef._key : headshot?.asset._id

    let compressedFile: File | null = null
    try {
      compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 900,
        useWebWorker: true,
      })
    } catch (error) {
      console.log('image compression error')
    }

    // upload image
    const imageReferences = await uploadImagesToSanity([compressedFile || file])

    if (
      imageReferences === 'GeneralError' ||
      imageReferences === 'SizeLimitError' ||
      imageReferences.length > 1
    ) {
      open()
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
      setHasUpdatedHeadshot(true)
      setImageRef(resJson.headshot)

      if (previousHeadshotId) {
        // delete previous headshot in background
        fetch('/api/sanity/images', {
          method: 'DELETE',
          body: JSON.stringify({ imageIds: [previousHeadshotId] }),
        })
      }
    } else {
      open()
    }

    setIsSubmitting(false)
  }

  const onImageDelete = async () => {
    // Can't delete something that isn't there
    if (!headshot && !imageRef) return

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
      open()
      return
    }

    // Delete what was the headshot
    let deleteRes: Response
    if (!hasUpdateHeadshot) {
      // delete original headshot prop
      // this is not a reference, but is instead the asset itself
      // delete image api route needs to handle just passing an id instead of refs
      deleteRes = await fetch('/api/sanity/images', {
        method: 'DELETE',
        body: JSON.stringify({ imageIds: [headshot?.asset._id] }),
      })
    } else {
      // delete imageRef
      deleteRes = await fetch('/api/sanity/images', {
        method: 'DELETE',
        body: JSON.stringify({ imageReferences: [imageRef] }),
      })
    }

    if (deleteRes.ok) {
      setHasUpdatedHeadshot(true)
      setImageRef(null)
      resetRef.current?.()
    } else {
      open()
    }

    setIsSubmitting(false)
  }

  return (
    <Stack>
      <Title ta="center" mb="md" order={2}>
        Update Headshot
      </Title>
      <Box p={0} m={0} pos="relative">
        <LoadingOverlay visible={isSubmitting} />
        <Image
          src={
            (!hasUpdateHeadshot ? headshot?.asset.url : imageRefUrl) ||
            '/user.svg'
          }
          alt="Artist headshot"
          width={300}
          height={300}
          placeholder={generateNextImagePlaceholder(300, 300)}
        />
      </Box>
      <Group justify="space-around">
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
        <Button
          onClick={onImageDelete}
          color="red"
          variant="outline"
          loading={isSubmitting}
        >
          Delete
        </Button>
      </Group>

      <Dialog opened={opened} onClose={close} p={0}>
        <Alert
          icon={icon}
          variant="filled"
          color="red.9"
          title="Bummer!"
          withCloseButton
          onClose={close}
        >
          {generalFailureMessage}
        </Alert>
      </Dialog>
    </Stack>
  )
}

export default AdminHeadshot
