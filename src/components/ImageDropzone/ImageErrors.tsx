import { Alert, List } from '@mantine/core'
import { FileRejection } from '@mantine/dropzone'

interface ImageErrorsProps {
  imageUploadRejections: FileRejection[]
  formError?: string
}

const ImageErrors = ({
  imageUploadRejections,
  formError,
}: ImageErrorsProps) => {
  if (imageUploadRejections.length === 0 && !formError) return undefined

  return (
    <Alert title="Image Errors">
      <List icon="•">
        {imageUploadRejections.length > 0 ? (
          imageUploadRejections[0].errors.map((error, i) => (
            <List.Item className="break-all" key={`${error.code}-${i}`}>
              {error.message}
            </List.Item>
          ))
        ) : (
          <List.Item key="image-upload-error">{formError}</List.Item>
        )}
      </List>
    </Alert>
  )
}

export default ImageErrors
