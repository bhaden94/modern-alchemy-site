'use client'

import { Box, Button, Stack, Title } from '@mantine/core'
import { FileRejection, FileWithPath } from '@mantine/dropzone'
import imageCompression from 'browser-image-compression'
import { useState } from 'react'

import { useErrorDialog } from '~/hooks/useErrorDialog'
import { ImageReference, uploadImagesToSanity } from '~/lib/sanity/sanity.image'
import { MAX_FILES } from '~/utils/forms/bookingFormUtils'

import ImageDropzone from '../../ImageDropzone/ImageDropzone'
import ImageErrors from '../../ImageDropzone/ImageErrors'
import ImageThumbnails from '../../ImageDropzone/ImageThumbnails'

interface IAdminPortfolioImages {
  artistId: string
  setPortfolioRefs: (imageRefs: ImageReference[]) => void
  submittingState: {
    isSubmitting: boolean
    setIsSubmitting: (value: boolean) => void
  }
}

const AdminPortfolioImages = ({
  artistId,
  setPortfolioRefs,
  submittingState,
}: IAdminPortfolioImages) => {
  const { isSubmitting, setIsSubmitting } = submittingState
  const [images, setImages] = useState<FileWithPath[]>([])
  const [imageUploadRejections, setImageUploadRejections] =
    useState<FileRejection[]>()
  const [isCompressing, setIsCompressing] = useState(false)
  const { openErrorDialog } = useErrorDialog()

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
      openErrorDialog()
    }

    setImageUploadRejections([])
    setIsCompressing(false)
  }

  const onThumbnailImageRemove = (nameToRemove: string) => {
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
      openErrorDialog()
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
      setPortfolioRefs(resJson.portfolioImages)
      setImages([])
    } else {
      openErrorDialog()
    }

    setIsSubmitting(false)
  }

  return (
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
          onImageRemove={onThumbnailImageRemove}
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
  )
}

export default AdminPortfolioImages
