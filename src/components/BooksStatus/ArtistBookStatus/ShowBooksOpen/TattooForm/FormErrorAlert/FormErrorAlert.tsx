import { Alert } from '@mantine/core'
import { IconExclamationCircle } from '@tabler/icons-react'

const FormErrorAlert = () => {
  return (
    <Alert
      variant="light"
      color="red"
      title="Oops!"
      icon={<IconExclamationCircle />}
    >
      There seems to be an error in your submission. Please correct any
      highlighted fields.
    </Alert>
  )
}

export default FormErrorAlert
