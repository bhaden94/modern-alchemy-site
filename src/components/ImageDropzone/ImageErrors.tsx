import { Alert, List } from '@mantine/core'
import { FileRejection } from '@mantine/dropzone'
import { IconExclamationCircle } from '@tabler/icons-react'

interface ImageErrorsProps {
  imageUploadRejections: FileRejection[]
  formError: string | undefined
}

const ImageErrors = ({
  imageUploadRejections,
  formError,
}: ImageErrorsProps) => {
  if (imageUploadRejections.length === 0 && !formError) return undefined

  return (
    <Alert
      variant="light"
      color="red"
      title="Alert title"
      icon={<IconExclamationCircle />}
      onClose={() => console.log('close alert')}
    >
      <List>
        {imageUploadRejections.length > 0 ? (
          imageUploadRejections[0].errors.map((error, i) => (
            <List.Item key={`${error.code}-${i}`}>{error.message}</List.Item>
          ))
        ) : (
          <List.Item key="image-upload-error">{formError}</List.Item>
        )}
      </List>
    </Alert>
  )
}

export default ImageErrors
