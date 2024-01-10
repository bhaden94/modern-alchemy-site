'use client'

import { Box, Button, Card, Grid, SimpleGrid, Text } from '@mantine/core'
import { useState } from 'react'

import { Booking } from '~/types/SanitySchemaTypes'
import { formatDate, formatPhoneNumber } from '~/utils'

import PortfolioCarousel from '../PortfolioCarousel/PortfolioCarousel'

interface IBookingCardProps {
  booking: Booking
}

export default function BookingCard({ booking }: IBookingCardProps) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const deleteBookingById = async () => {
    // TODO: Add confirmation for delete
    setIsDeleting(true)
    const response = await fetch('/api/sanity/booking', {
      method: 'DELETE',
      body: JSON.stringify({ id: booking._id }),
    })
    // TODO: handle error in response
    setIsDeleting(false)

    if (response.ok) {
      // trigger without awaiting so it does not hold up the UI
      fetch('/api/sanity/images', {
        method: 'DELETE',
        body: JSON.stringify({ imageReferences: booking.referenceImages }),
      })
    }
  }

  return (
    <Card withBorder radius="md" my={16}>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {Boolean(booking.referenceImages.length > 0) ? (
          <Box>
            <PortfolioCarousel images={booking.referenceImages} />
          </Box>
        ) : (
          <Box />
        )}
        <Grid gutter="md">
          <Grid.Col>
            <Text>Submitted on:&nbsp;{formatDate(booking._createdAt)}</Text>
            <Text>Name:&nbsp;{booking.name}</Text>
            <Text>Email:&nbsp;{booking.email}</Text>
            <Text>
              Phone number:&nbsp;{formatPhoneNumber(booking.phoneNumber)}
            </Text>
          </Grid.Col>
          <Grid.Col>
            <Text>Location:&nbsp;{booking.location}</Text>
            <Text>Style:&nbsp;{booking.style}</Text>
          </Grid.Col>
          <Grid.Col>
            <Text>Description:&nbsp;{booking.description}</Text>
          </Grid.Col>
        </Grid>
      </SimpleGrid>
      <Button
        onClick={() => deleteBookingById()}
        loading={isDeleting}
        variant="outline"
        color="red"
        mt={16}
        className="self-center"
      >
        Delete Booking
      </Button>
    </Card>
  )
}
