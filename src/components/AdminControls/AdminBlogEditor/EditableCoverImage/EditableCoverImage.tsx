'use client'

import { Button, Group, Stack, Text } from '@mantine/core'
import {
  Dropzone,
  DropzoneProps,
  FileRejection,
  FileWithPath,
} from '@mantine/dropzone'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react'
import React, { useRef, useState } from 'react'

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
}

const EditableCoverImage = ({
  imageRef,
  onReplace,
  onRemove,
  disabled = false,
  dropzoneProps,
}: EditableCoverImageProps) => {
  const [rejectionMessage, setRejectionMessage] = useState<string>('')
  const openRef = useRef<() => void>(null)
  let image: { url: string; altText?: string } | undefined =
    imageRef && 'url' in imageRef
      ? { url: imageRef.url, altText: imageRef.alt }
      : getImageFromRef(imageRef)

  const coverImage: { url: string; alt: string } | undefined = image && {
    url: image.url,
    alt: image.altText || 'Editable cover image',
  }

  const AlwaysShownInDropzone = () => {
    return (
      <Group justify="center" className={classes.dropzoneAlwaysShownInner}>
        <Dropzone.Accept>
          <IconUpload className={classes.iconUpload} stroke={1.5} />
        </Dropzone.Accept>

        <Dropzone.Reject>
          <IconX className={classes.iconX} stroke={1.5} />
        </Dropzone.Reject>

        <Dropzone.Idle>
          {!image && <IconPhoto className={classes.iconPhoto} stroke={1.5} />}
        </Dropzone.Idle>
      </Group>
    )
  }

  const WithImageToolbar = () => {
    return (
      <Group justify="center" align="center">
        <Button
          size="sm"
          onClick={() => openRef.current?.()}
          className={classes.toolbarAction}
          disabled={disabled}
        >
          Change cover image
        </Button>
        {onRemove && (
          <Button
            size="sm"
            color="red"
            onClick={() => onRemove()}
            className={classes.toolbarAction}
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
      <>
        <Text size="md" c="dimmed">
          or
        </Text>
        <Button
          size="sm"
          onClick={() => openRef.current?.()}
          className={classes.toolbarAction}
          disabled={disabled}
        >
          Add cover image
        </Button>
      </>
    )
  }

  const DynamicDropzoneElements = () => {
    return (
      <Stack justify="center" align="center" gap={3}>
        <Text size="xl" ta="center">
          <Dropzone.Accept>Drop images here</Dropzone.Accept>
          <Dropzone.Reject>{rejectionMessage}</Dropzone.Reject>
          {!image && (
            <Dropzone.Idle>Drag&apos;n&apos;drop images here</Dropzone.Idle>
          )}
        </Text>
        {image ? <WithImageToolbar /> : <WithoutImageToolbar />}
      </Stack>
    )
  }

  return (
    <div className={classes.wrapper}>
      <CoverImage image={coverImage} overlayZIndex={1} />

      {onReplace && (
        <Dropzone
          className={classes.dropzone}
          openRef={openRef}
          activateOnClick={false}
          maxFiles={1}
          onDrop={(files: FileWithPath[]) => onReplace(files)}
          onReject={(rejections: FileRejection[]) => {
            setRejectionMessage(rejections?.[0]?.errors?.[0]?.message || '')
          }}
          accept={ACCEPTED_IMAGE_TYPES}
          disabled={disabled}
          {...dropzoneProps}
        >
          <AlwaysShownInDropzone />
          <DynamicDropzoneElements />
        </Dropzone>
      )}
    </div>
  )
}

export default EditableCoverImage
