'use client'

import { Button, ButtonProps, Group, Popover, Text } from '@mantine/core'
import { useState } from 'react'

interface IDeleteWithConfirmation {
  isDeleting: boolean
  onDeleteConfirmed: () => void
  disabled?: boolean
  confirmationMessage?: string
  deleteButtonText?: string
  buttonProps?: Partial<ButtonProps>
}

const DeleteWithConfirmation = ({
  isDeleting,
  onDeleteConfirmed,
  disabled = false,
  confirmationMessage = 'Are you sure you want to delete this?',
  deleteButtonText = 'Delete',
  buttonProps,
}: IDeleteWithConfirmation) => {
  const [popoverOpened, setPopoverOpened] = useState(false)

  const deleteConfirmed = () => {
    setPopoverOpened((o) => !o)
    onDeleteConfirmed()
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
          disabled={disabled}
          color="red"
          {...buttonProps}
        >
          {deleteButtonText}
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="flex flex-col">
        <Text>{confirmationMessage}</Text>
        <Group justify="center">
          <Button
            onClick={() => setPopoverOpened((o) => !o)}
            disabled={isDeleting}
            mt={16}
            className="self-center"
          >
            Do not delete
          </Button>
          <Button
            onClick={() => deleteConfirmed()}
            disabled={isDeleting}
            color="red"
            mt={16}
            className="self-center"
          >
            Confirm Deletion
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  )
}

export default DeleteWithConfirmation
