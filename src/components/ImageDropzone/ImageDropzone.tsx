'use client'

import { Button, Group, rem, Stack, Text } from '@mantine/core'
import {
  Dropzone,
  DropzoneProps,
  FileRejection,
  FileWithPath,
} from '@mantine/dropzone'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react'
import { useRef } from 'react'

import { ACCEPTED_IMAGE_TYPES } from '~/utils/forms/FormConstants'

import classes from './ImageDropzone.module.css'

interface ImageDropzoneProps {
  onImageDrop: (files: FileWithPath[]) => void
  onImageReject: (rejections: FileRejection[]) => void
  disabled?: boolean
  dropzoneProps?: Partial<DropzoneProps>
  rejectionMessage?: string
  uploadButtonText?: string
}

const ImageDropzone = ({
  onImageDrop,
  onImageReject,
  disabled = false,
  dropzoneProps,
  rejectionMessage = 'That is not supported.',
  uploadButtonText = 'Attach files',
}: ImageDropzoneProps) => {
  const openRef = useRef<() => void>(null)

  return (
    <>
      <Dropzone
        className={classes.dropzone}
        openRef={openRef}
        onDrop={(files) => onImageDrop(files)}
        onReject={(rejections) => onImageReject(rejections)}
        accept={ACCEPTED_IMAGE_TYPES}
        aria-label="Image dropzone"
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

        <Stack justify="center" align="center" gap={3}>
          <Text size="xl">
            <Dropzone.Accept>Drop images here</Dropzone.Accept>
            <Dropzone.Reject>{rejectionMessage}</Dropzone.Reject>
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
            {uploadButtonText}
          </Button>
        </Stack>
      </Dropzone>
    </>
  )
}

export default ImageDropzone
