'use client'

import {
  Box,
  Group,
} from '@mantine/core'
import { useState } from 'react'

import { Artist } from '~/schemas/models/artist'
import { ImageReference } from '~/utils/images/uploadImagesToSanity'

import AdminHeadshot from './AdminHeadshot/AdminHeadshot'
import AdminPortfolioImages from './AdminPortfolioImages/AdminPortfolioImages'
import AdminPortfolioImagesDisplay from './AdminPortfolioImages/AdminPortfolioImagesDisplay'

const AdminPortfolioSettingControls = ({ artist }: { artist: Artist }) => {
  const [portfolioImageRefs, setPortfolioImageRefs] = useState<
    ImageReference[]
  >(artist.portfolioImages || [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <>
      <Group justify="space-around" align="start" gap="lg">
        <Box w={{ base: '100%', sm: 300 }}>
          <AdminHeadshot artistId={artist._id} headshotRef={artist.headshot} />
        </Box>
        <Box w={{ base: '100%', sm: 300 }}>
          <AdminPortfolioImages
            artistId={artist._id}
            setPortfolioRefs={setPortfolioImageRefs}
            submittingState={{ isSubmitting, setIsSubmitting }}
          />
        </Box>
      </Group>
      <AdminPortfolioImagesDisplay
        artistId={artist._id}
        imageRefs={portfolioImageRefs}
        setPortfolioRefs={setPortfolioImageRefs}
        submittingState={{ isSubmitting, setIsSubmitting }}
      />
    </>
  )
}

export default AdminPortfolioSettingControls
