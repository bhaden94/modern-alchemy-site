'use client'

import {
  Alert,
  Box,
  Card,
  Grid,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useState } from 'react'

import { Booking } from '~/schemas/models/booking'
import { formatDate } from '~/utils'
import { BookingField } from '~/utils/forms/bookingFormUtils'

import CarouselWithThumbnails from '../../CarouselWithThumbnails/CarouselWithThumbnails'
import DeleteWithConfirmation from '../../DeleteWithConfirmation/DeleteWithConfirmation'
import InputCopyButton from './InputCopyButton/InputCopyButton'

interface BookingFieldProperty {
  id: keyof Booking
  label: string
  getValue: (value: string) => string
}

interface IBookingCardProps {
  booking: Booking
}

export default function BookingCard({ booking }: IBookingCardProps) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const deleteBookingById = async () => {
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

  const renderInput = (field: BookingFieldProperty) => {
    return (
      <TextInput
        key={field.label}
        label={<Text span>{field.label}</Text>}
        value={field.getValue(booking[field.id])}
        variant="filled"
        readOnly
        leftSectionPointerEvents="auto"
        leftSection={
          <InputCopyButton value={field.getValue(booking[field.id])} />
        }
      />
    )
  }

  const renderComponent = (field: BookingFieldProperty) => {
    switch (field.id) {
      case BookingField.Description.id:
        return (
          <Textarea
            key={field.label}
            label={<Text span>{BookingField.Description.label}</Text>}
            value={BookingField.Description.getValue(booking.description)}
            variant="filled"
            readOnly
            autosize
            minRows={2}
            maxRows={8}
            leftSectionPointerEvents="auto"
            leftSection={
              <InputCopyButton
                value={BookingField.Description.getValue(booking.description)}
              />
            }
          />
        )
      case BookingField.ReferenceImages.id:
        return null
      default:
        return renderInput(field)
    }
  }

  const BookingFieldsDisplay = () =>
    Object.values(BookingField).map((field) =>
      renderComponent(field as BookingFieldProperty),
    )

  return (
    <Card withBorder radius="md" my={16}>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {Boolean(booking.referenceImages.length > 0) ? (
          <Box>
            <CarouselWithThumbnails images={booking.referenceImages} />
          </Box>
        ) : (
          <Alert title="Image Upload Issue" color="red.9">
            There was an issue with images uploading for this booking request.
            You may want to follow up with the requester.
          </Alert>
        )}
        <Grid gutter="md">
          <Grid.Col>
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
            <BookingFieldsDisplay />
          </Grid.Col>
        </Grid>
      </SimpleGrid>
      <DeleteWithConfirmation
        isDeleting={isDeleting}
        onDeleteConfirmed={deleteBookingById}
        deleteButtonText="Delete Booking"
        confirmationMessage={`Are you sure you want to delete the booking for ${booking.name}?`}
      />
    </Card>
  )
}
