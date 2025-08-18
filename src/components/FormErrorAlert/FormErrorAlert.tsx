import { Alert } from '@mantine/core'

interface IFormErrorAlert {
  message?: string
  title?: string
}

const FormErrorAlert = ({ message, title }: IFormErrorAlert) => {
  return (
    <Alert title={title}>
      {message ||
        'There seems to be an error in your submission. Please correct any highlighted fields.'}
    </Alert>
  )
}

export default FormErrorAlert
