'use client'

import { Alert, Dialog } from '@mantine/core'

interface ISuccessDialog {
  opened: boolean
  onClose: () => void
  message?: string
  title?: string
}

const defaultSuccessMessage = 'Update successful.'
const SuccessDialog = ({
  opened,
  onClose,
  message = defaultSuccessMessage,
  title = 'Success!',
}: ISuccessDialog) => {
  return (
    <Dialog opened={opened} onClose={onClose} p={0}>
      <Alert color="green" title={title} withCloseButton onClose={onClose}>
        {message}
      </Alert>
    </Dialog>
  )
}

export default SuccessDialog
