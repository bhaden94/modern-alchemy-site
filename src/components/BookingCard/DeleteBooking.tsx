'use client'

import { Button, Group, Popover, Text } from '@mantine/core'
import { useState } from 'react'

import booking from '~/schemas/models/booking'

interface IDeleteBooking {
  isDeleting: boolean
  deleteBookingById: () => void
}

const DeleteBooking = ({ isDeleting, deleteBookingById }: IDeleteBooking) => {
  const [popoverOpened, setPopoverOpened] = useState(false)

  const deleteConfirmed = () => {
    setPopoverOpened((o) => !o)
    deleteBookingById()
  }

  return (
    <Popover
      width="fit-content"
      position="bottom"
      shadow="md"
      opened={popoverOpened}
      onChange={setPopoverOpened}
    >
      <Popover.Target>
        <Button
          onClick={() => setPopoverOpened((o) => !o)}
          loading={isDeleting}
          variant="outline"
          color="red"
          mt={16}
          className="self-center"
        >
          Delete Booking
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="flex flex-col">
        <Text>
          Are you sure you want to delete the booking for {booking.name}?
        </Text>
        <Group justify="center">
          <Button
            onClick={() => deleteConfirmed()}
            loading={isDeleting}
            variant="outline"
            color="red"
            mt={16}
            className="self-center"
          >
            Confirm Deletion
          </Button>
          <Button
            onClick={() => setPopoverOpened((o) => !o)}
            loading={isDeleting}
            mt={16}
            className="self-center"
          >
            Do not delete
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  )
}

export default DeleteBooking
