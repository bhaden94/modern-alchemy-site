'use client'

import {
  Box,
  Button,
  Card,
  Grid,
  Group,
  Popover,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useState } from 'react'

import { Booking } from '~/schemas/models/booking'
import { formatDate, formatPhoneNumber } from '~/utils'
import {
  preferredDayOptions,
  priorTattooOptions,
} from '~/utils/bookingFormUtils'

import PortfolioCarousel from '../PortfolioCarousel/PortfolioCarousel'
import DeleteBooking from './DeleteBooking'
import InputCopyButton from './InputCopyButton'

interface IBookingCardProps {
  booking: Booking
}

const joinPrefferedDayLabels = (days: string[]): string => {
  if (days.length === 5) {
    return 'Any weekday'
  }

  const labels: string[] = []

  preferredDayOptions.forEach((option) => {
    if (days.includes(option.value)) {
      labels.push(option.label)
    }
  })

  return labels.join(', ')
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
          <Grid.Col span={{ base: 12, xl: 6 }}>
            <TextInput
              label={<Text span>Submitted on</Text>}
              value={formatDate(booking._createdAt)}
              variant="filled"
              readOnly
              leftSectionPointerEvents="auto"
              leftSection={
                <InputCopyButton value={formatDate(booking._createdAt)} />
              }
            />
            <TextInput
              label={<Text span>Location</Text>}
              value={booking.location}
              variant="filled"
              readOnly
              leftSectionPointerEvents="auto"
              leftSection={<InputCopyButton value={booking.location} />}
            />
            <TextInput
              label={<Text span>Style</Text>}
              value={
                booking.style === 'black_and_grey' ? 'Black & Grey' : 'Color'
              }
              variant="filled"
              readOnly
              leftSectionPointerEvents="auto"
              leftSection={
                <InputCopyButton
                  value={
                    booking.style === 'black_and_grey'
                      ? 'Black & Grey'
                      : 'Color'
                  }
                />
              }
            />
            <TextInput
              label={<Text span>Prior Tattoo</Text>}
              value={
                priorTattooOptions.find(
                  (option) => option.value === booking.priorTattoo,
                )?.label
              }
              variant="filled"
              readOnly
              leftSectionPointerEvents="auto"
              leftSection={
                <InputCopyButton
                  value={
                    priorTattooOptions.find(
                      (option) => option.value === booking.priorTattoo,
                    )?.label || 'No'
                  }
                />
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, xl: 6 }}>
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
            <TextInput
              label={<Text span>Preferred Days</Text>}
              value={joinPrefferedDayLabels(booking.preferredDays)}
              variant="filled"
              readOnly
              leftSectionPointerEvents="auto"
              leftSection={
                <InputCopyButton
                  value={joinPrefferedDayLabels(booking.preferredDays)}
                />
              }
            />
            <TextInput
              label={<Text span>Characters</Text>}
              value={booking.characters}
              variant="filled"
              readOnly
              leftSectionPointerEvents="auto"
              leftSection={<InputCopyButton value={booking.characters} />}
            />
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
      <DeleteBooking
        isDeleting={isDeleting}
        deleteBookingById={deleteBookingById}
        bookingName={booking.name}
      />
    </Card>
  )
}
