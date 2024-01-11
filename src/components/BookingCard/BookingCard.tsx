'use client'

import {
  Box,
  Button,
  Card,
  Grid,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useState } from 'react'

import { Booking } from '~/types/SanitySchemaTypes'
import { formatDate, formatPhoneNumber } from '~/utils'

import PortfolioCarousel from '../PortfolioCarousel/PortfolioCarousel'
import InputCopyButton from './InputCopyButton'

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
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <TextInput
              label={<Text span>Submitted on</Text>}
              value={formatDate(booking._createdAt)}
              variant="filled"
              readOnly
            />
            <TextInput
              label={<Text span>Location</Text>}
              value={booking.location}
              variant="filled"
              readOnly
            />
            <TextInput
              label={<Text span>Style</Text>}
              value={booking.style}
              variant="filled"
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <TextInput
              label={<Text span>Phone Number</Text>}
              value={formatPhoneNumber(booking.phoneNumber) || ''}
              variant="filled"
              readOnly
              leftSectionPointerEvents="auto"
              leftSection={<InputCopyButton value={booking.phoneNumber} />}
            />
            <TextInput
              label={<Text span>Name</Text>}
              value={booking.name}
              variant="filled"
              readOnly
              leftSectionPointerEvents="auto"
              leftSection={<InputCopyButton value={booking.name} />}
            />
            <TextInput
              label={<Text span>Email</Text>}
              value={booking.email}
              variant="filled"
              readOnly
              leftSectionPointerEvents="auto"
              leftSection={<InputCopyButton value={booking.email} />}
            />
          </Grid.Col>
          <Grid.Col>
            <Textarea
              label={<Text span>Description</Text>}
              value={booking.description}
              variant="filled"
              readOnly
              autosize
              minRows={2}
              maxRows={8}
              leftSectionPointerEvents="auto"
              leftSection={<InputCopyButton value={booking.description} />}
            />
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
