'use client'

import {
  Alert,
  Box,
  Dialog,
  Group,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'

import { Artist } from '~/schemas/models/artist'
import { ImageReference } from '~/utils/images/uploadImagesToSanity'

import CarouselWithThumbnails from '../CarouselWithThumbnails/CarouselWithThumbnails'
import AdminBooksStatus from './AdminBooksStatus/AdminBooksStatus'
import AdminHeadshot from './AdminHeadshot/AdminHeadshot'
import AdminPortfolioImages from './AdminPortfolioImages/AdminPortfolioImages'

const generalFailureMessage = 'Something went wrong. Please try to re-submit.'
const AdminControls = ({ artist }: { artist: Artist }) => {
  const [opened, { open, close }] = useDisclosure(false)
  const [portfolioImageRefs, setPortfolioImageRefs] = useState<
    ImageReference[]
  >(artist.portfolioImages || [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const deleteImage = async (imageRef?: ImageReference) => {
    if (!imageRef) return
    setIsSubmitting(true)

    // Clear image from array
    const response = await fetch('/api/sanity/artist', {
      method: 'PATCH',
      body: JSON.stringify({
        portfolioImages: [imageRef],
        operation: 'DELETE',
        artistId: artist._id,
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
      <Group justify="space-around" align="start" gap="lg">
        <Box w={{ base: '100%', sm: 300 }}>
          <AdminBooksStatus
            booksStatus={{
              booksOpen: artist.booksOpen,
              booksOpenAt: artist.booksOpenAt,
              name: artist.name,
              _id: artist._id,
            }}
          />
        </Box>
        <Box w={{ base: '100%', sm: 300 }}>
          <AdminHeadshot artistId={artist._id} headshotRef={artist.headshot} />
        </Box>
        <Box w={{ base: '100%', sm: 300 }}>
          <AdminPortfolioImages
            artistId={artist._id}
            setPortfolioRefs={setPortfolioImageRefs}
            submittingState={{ isSubmitting, setIsSubmitting }}
            onFailure={open}
          />
        </Box>
      </Group>
      <SimpleGrid cols={1} mt="lg">
        <Stack gap={0}>
          <Title ta="center" mb="md" order={2}>
            Portfolio Images
          </Title>
          <Box pos="relative">
            <LoadingOverlay visible={isSubmitting} zIndex={150} />
            <CarouselWithThumbnails
              imageRefs={portfolioImageRefs}
              deleteImageCallback={deleteImage}
              isDeleting={isSubmitting}
            />
          </Box>
        </Stack>
      </SimpleGrid>

      <Dialog opened={opened} onClose={close} p={0}>
        <Alert title="Bummer!" withCloseButton onClose={close}>
          {generalFailureMessage}
        </Alert>
      </Dialog>
    </>
  )
}

export default AdminControls
