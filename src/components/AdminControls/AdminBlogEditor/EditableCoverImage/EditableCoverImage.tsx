'use client'

import { Button, Group, rem, Stack, Text } from '@mantine/core'
import {
  Dropzone,
  DropzoneProps,
  FileRejection,
  FileWithPath,
} from '@mantine/dropzone'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react'
import React, { useRef } from 'react'

import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { ACCEPTED_IMAGE_TYPES } from '~/utils/forms/FormConstants'
import { ImageReference } from '~/utils/images/uploadImagesToSanity'

import CoverImage from '../../../Blog/CoverImage/CoverImage'
import classes from './EditableCoverImage.module.css'

interface EditableCoverImageProps {
  imageRef?: ImageReference | { url: string; alt?: string }
  onReplace?: (files: FileWithPath[]) => void
  onRemove?: () => void
  disabled?: boolean
  dropzoneProps?: Partial<DropzoneProps>
  rejectionMessage?: string
}

const EditableCoverImage = ({
  imageRef,
  onReplace,
  onRemove,
  disabled = false,
  dropzoneProps,
  rejectionMessage = 'File type not supported',
}: EditableCoverImageProps) => {
  const openRef = useRef<() => void>(null)
  // Prefer resolving a server ImageReference to a displayable image.
  // If that fails, and a local preview object was provided (contains url), use it for immediate preview.
  let image: any = getImageFromRef(imageRef as ImageReference | undefined)
  if (!image && imageRef && typeof (imageRef as any).url === 'string') {
    image = {
      url: (imageRef as any).url,
      altText: (imageRef as any).alt || 'Blog cover image',
    }
  }

  const WithImageToolbar = () => {
    return (
      <Group gap="xs">
        <Button
          size="sm"
          onClick={() => openRef.current?.()}
          style={{ pointerEvents: 'all' }}
          disabled={disabled}
        >
          Change cover image
        </Button>
        {onRemove && (
          <Button
            size="sm"
            color="red"
            onClick={() => onRemove()}
            style={{ pointerEvents: 'all' }}
            disabled={disabled}
          >
            Remove cover image
          </Button>
        )}
      </Group>
    )
  }

  const WithoutImageToolbar = () => {
    return (
      <Stack justify="center" className={classes.centerContent}>
        <Button
          size="sm"
          onClick={() => openRef.current?.()}
          style={{ pointerEvents: 'all' }}
          disabled={disabled}
        >
          Add cover image
        </Button>
      </Stack>
    )
  }

  return (
    <div className={classes.wrapper}>
      {image ? (
        <CoverImage
          image={{ url: image.url, alt: image.altText || 'Blog cover image' }}
          overlayZIndex={1}
        />
      ) : (
        <div className={classes.placeholder} />
      )}

      {onReplace && (
        <Dropzone
          className={classes.dropzone}
          openRef={openRef}
          activateOnClick={false}
          maxFiles={1}
          onDrop={(files: FileWithPath[]) => onReplace(files)}
          onReject={(rejections: FileRejection[]) => {
            // keep this noop by default; parent can pass custom handler via dropzoneProps
          }}
          accept={ACCEPTED_IMAGE_TYPES}
          disabled={disabled}
          {...dropzoneProps}
        >
          <Group
            justify="center"
            className={classes.centerContent}
            style={{ pointerEvents: 'none' }}
          >
            <Dropzone.Accept>
              <IconUpload
                style={{ width: rem(52), height: rem(52), color: 'primary' }}
                stroke={1.5}
              />
              <Text>Drop images here</Text>
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
              <Text>{rejectionMessage}</Text>
            </Dropzone.Reject>

            <Dropzone.Idle>
              {!image && (
                <>
                  <IconPhoto
                    style={{
                      width: rem(52),
                      height: rem(52),
                      color: 'var(--mantine-color-dimmed)',
                    }}
                    stroke={1.5}
                  />
                  <Text size="xl" ta="center">
                    Drag&apos;n&apos;drop images here
                  </Text>
                  <Text size="md" c="dimmed">
                    or
                  </Text>
                </>
              )}
            </Dropzone.Idle>

            {image ? <WithImageToolbar /> : <WithoutImageToolbar />}
          </Group>
        </Dropzone>
      )}
    </div>
  )
}

export default EditableCoverImage
