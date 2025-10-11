'use client'

import { Box, LoadingOverlay, SimpleGrid, Stack, Title } from '@mantine/core'

import CarouselWithThumbnails from '~/components/CarouselWithThumbnails/CarouselWithThumbnails'
import { useErrorDialog } from '~/hooks/useErrorDialog'
import { ImageReference } from '~/lib/sanity/sanity.image'

interface IAdminPortfolioImagesDisplay {
  artistId: string
  imageRefs: ImageReference[]
  setPortfolioRefs: (imageRefs: ImageReference[]) => void
  submittingState: {
    isSubmitting: boolean
    setIsSubmitting: (value: boolean) => void
  }
}

const AdminPortfolioImagesDisplay = ({
  artistId,
  imageRefs,
  setPortfolioRefs,
  submittingState,
}: IAdminPortfolioImagesDisplay) => {
  const { isSubmitting, setIsSubmitting } = submittingState
  const { openErrorDialog } = useErrorDialog()

  const deleteImage = async (imageRef?: ImageReference) => {
    if (!imageRef) return
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
      openErrorDialog()
      setIsSubmitting(false)
      return
    }

    // Delete image
    const deleteRes = await fetch('/api/sanity/images', {
      method: 'DELETE',
      body: JSON.stringify({ imageReferences: [imageRef] }),
    })

    if (deleteRes.ok) {
      const resJson = await response.json()
      setPortfolioRefs(resJson.portfolioImages)
    } else {
      openErrorDialog()
    }

    setIsSubmitting(false)
  }

  return (
    <SimpleGrid cols={1} mt="lg">
      <Stack gap={0}>
        <Title ta="center" mb="md" order={2}>
          Portfolio Images
        </Title>
        <Box pos="relative">
          <LoadingOverlay visible={isSubmitting} zIndex={150} />
          <CarouselWithThumbnails
            imageRefs={imageRefs}
            deleteImageCallback={deleteImage}
            isDeleting={isSubmitting}
          />
        </Box>
      </Stack>
    </SimpleGrid>
  )
}

export default AdminPortfolioImagesDisplay
