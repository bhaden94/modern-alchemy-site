'use client'

import { Button, Group, rem, Text } from '@mantine/core'
import {
  Dropzone,
  DropzoneProps,
  FileRejection,
  FileWithPath,
  IMAGE_MIME_TYPE,
} from '@mantine/dropzone'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react'
import { useRef } from 'react'

import { formatBytes } from '~/utils'
import { MAX_FILE_SIZE, MAX_FILES } from '~/utils/bookingFormUtils'

interface ImageDropzoneProps {
  onImageDrop: (files: FileWithPath[]) => void
  onImageReject: (rejections: FileRejection[]) => void
  disabled?: boolean
  dropzoneProps?: Partial<DropzoneProps>
}

const ImageDropzone = ({
  onImageDrop,
  onImageReject,
  disabled = false,
  dropzoneProps,
}: ImageDropzoneProps) => {
  const openRef = useRef<() => void>(null)

  return (
    <>
      <Dropzone
        openRef={openRef}
        onDrop={(files) => onImageDrop(files)}
        onReject={(rejections) => onImageReject(rejections)}
        accept={IMAGE_MIME_TYPE}
        aria-label="Image dropzone"
        maxSize={MAX_FILE_SIZE}
        maxFiles={MAX_FILES}
        disabled={disabled}
        {...dropzoneProps}
      >
        <Group justify="center" style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              style={{
                width: rem(52),
                height: rem(52),
                color: 'primary',
              }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-red-6)',
              }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-dimmed)',
              }}
              stroke={1.5}
            />
          </Dropzone.Idle>
        </Group>

        <div className="flex flex-col justify-center items-center gap-3">
          <Text size="xl">
            <Dropzone.Accept>Drop images here</Dropzone.Accept>
            <Dropzone.Reject>
              There is a max of {MAX_FILES} image files allowed up to{' '}
              {formatBytes(MAX_FILE_SIZE)} in size
            </Dropzone.Reject>
            <Dropzone.Idle>Drag&apos;n&apos;drop images here</Dropzone.Idle>
          </Text>
          <Text size="md" c="dimmed">
            or
          </Text>
          <Button
            variant="filled"
            size="sm"
            onClick={() => openRef.current?.()}
            disabled={disabled}
          >
            Attach files
          </Button>
        </div>
      </Dropzone>
    </>
  )
}

export default ImageDropzone
