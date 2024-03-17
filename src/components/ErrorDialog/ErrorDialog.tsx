'use client'

import { Alert, Dialog } from '@mantine/core'

interface IErrorDialog {
  opened: boolean
  onClose: () => void
  message?: string
  title?: string
}

const generalFailureMessage = 'Something went wrong. Please try to re-submit.'
const ErrorDialog = ({
  opened,
  onClose,
  message = generalFailureMessage,
  title = 'Bummer!',
}: IErrorDialog) => {
  return (
    <Dialog opened={opened} onClose={onClose} p={0}>
      <Alert title={title} withCloseButton onClose={onClose}>
        {message}
      </Alert>
    </Dialog>
  )
}

export default ErrorDialog
