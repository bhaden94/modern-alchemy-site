'use client'

import {
  Alert,
  Box,
  Button,
  Dialog,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  Title,
} from '@mantine/core'
import { FileRejection, FileWithPath } from '@mantine/dropzone'
import { useDisclosure } from '@mantine/hooks'
import imageCompression from 'browser-image-compression'
import { useState } from 'react'

import { MAX_FILES } from '~/utils/forms/bookingFormUtils'
import uploadImagesToSanity, {
  ImageReference,
} from '~/utils/images/uploadImagesToSanity'

import CarouselWithThumbnails from '../CarouselWithThumbnails/CarouselWithThumbnails'
import ImageDropzone from '../ImageDropzone/ImageDropzone'
import ImageErrors from '../ImageDropzone/ImageErrors'
import ImageThumbnails from '../ImageDropzone/ImageThumbnails'

interface IAdminPortfolioImages {
  artistId: string
  portfolioRefs?: ImageReference[]
}

const generalFailureMessage = 'Something went wrong. Please try to re-submit.'
const AdminPortfolioImages = ({
  artistId,
  portfolioRefs,
}: IAdminPortfolioImages) => {
  const [opened, { open, close }] = useDisclosure(false)
  const [portfolioImageRefs, setPortfolioImageRefs] = useState<
    ImageReference[]
  >(portfolioRefs || [])
  const [images, setImages] = useState<FileWithPath[]>([])
  const [imageUploadRejections, setImageUploadRejections] =
    useState<FileRejection[]>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)

  const onImageDrop = async (files: FileWithPath[]) => {
    setIsCompressing(true)

    try {
      const filesPromises = files.map((file) =>
        imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        }),
      )
      const compressedImages = await Promise.all(filesPromises)

      setImages(compressedImages)
    } catch (error) {
      open()
    }

    setImageUploadRejections([])
    setIsCompressing(false)
  }

  const onImageRemove = (nameToRemove: string) => {
    setIsSubmitting(true)
    const filteredImages = images.filter((image) => image.name !== nameToRemove)
    setImages(filteredImages)
    setIsSubmitting(false)
  }

  const uploadImages = async () => {
    setIsSubmitting(true)

    const imageReferences = await uploadImagesToSanity(images)

    if (
      imageReferences === 'GeneralError' ||
      imageReferences === 'SizeLimitError'
    ) {
      open()
      setIsSubmitting(false)
      return
    }

    const response = await fetch('/api/sanity/artist', {
      method: 'PATCH',
      body: JSON.stringify({
        portfolioImages: imageReferences,
        operation: 'APPEND',
        artistId: artistId,
      }),
    })

    if (response.ok) {
      const resJson = await response.json()
      setPortfolioImageRefs(resJson.portfolioImages)
      setImages([])
    } else {
      open()
    }

    setIsSubmitting(false)
  }

  const deleteImage = async (imageRef: ImageReference) => {
    setIsSubmitting(true)

    // Clear image from array
    const response = await fetch('/api/sanity/artist', {
      method: 'PATCH',
      body: JSON.stringify({
        portfolioImages: [imageRef],
        operation: 'DELETE',
        artistId: artistId,
      }),
    })

    if (!response.ok) {
      open()
      return
    }

    // Delete image
    const deleteRes = await fetch('/api/sanity/images', {
      method: 'DELETE',
      body: JSON.stringify({ imageReferences: [imageRef] }),
    })

    if (deleteRes.ok) {
      const resJson = await response.json()
      setPortfolioImageRefs(resJson.portfolioImages)
    } else {
      open()
    }

    setIsSubmitting(false)
  }

  return (
    <>
      <Box w={{ md: 300 }}>
        <Stack gap={0}>
          <Title ta="center" mb="md" order={2}>
            Update Portfolio Images
          </Title>
          <Box>
            <ImageDropzone
              onImageDrop={onImageDrop}
              onImageReject={setImageUploadRejections}
              disabled={isCompressing || isSubmitting}
              dropzoneProps={{
                loading: isCompressing || isSubmitting,
                maxFiles: MAX_FILES,
              }}
              rejectionMessage={`There is a max of ${MAX_FILES} image files allowed.`}
            />
            <ImageThumbnails
              imageFiles={images}
              onImageRemove={onImageRemove}
            />
            <ImageErrors
              imageUploadRejections={
                imageUploadRejections ? imageUploadRejections : []
              }
            />
          </Box>
          <Button
            variant="filled"
            loading={isSubmitting}
            disabled={images.length === 0}
            onClick={uploadImages}
          >
            Upload Images
          </Button>
        </Stack>
      </Box>
      <SimpleGrid>
        <Title ta="center" mb="md" order={2}>
          Portfolio Images
        </Title>
        <Box p={0} m={0} pos="relative">
          <LoadingOverlay visible={isSubmitting} />
          <CarouselWithThumbnails
            imageRefs={portfolioImageRefs}
            deleteImageCallback={deleteImage}
            isDeleting={isSubmitting}
          />
        </Box>
      </SimpleGrid>

      <Dialog opened={opened} onClose={close} p={0}>
        <Alert title="Bummer!" withCloseButton onClose={close}>
          {generalFailureMessage}
        </Alert>
      </Dialog>
    </>
  )
}

export default AdminPortfolioImages
