'use client'

import { FileButton } from '@mantine/core'
import { useEditor } from '@portabletext/editor'
import { IconUpload } from '@tabler/icons-react'
import imageCompression from 'browser-image-compression'

import { ACCEPTED_IMAGE_TYPES } from '~/utils/forms/FormConstants'
import uploadImagesToSanity from '~/utils/images/uploadImagesToSanity'

import BaseToolbarButton from '../BaseToolbarButton/BaseToolbarButton'

const imageIconMap = {
  image: <IconUpload size={16} />,
} as const

interface IImageButton {
  image: { name: keyof typeof imageIconMap }
}

const ImageButton = ({ image }: IImageButton) => {
  const imageIcon = imageIconMap[image.name]
  const editor = useEditor()

  const onImageUpload = async (imageFile: File | null) => {
    if (!imageFile) return

    // Trigger 'read only' event in the editor to show loading state
    editor.send({ type: 'update readOnly', readOnly: true })

    let compressedImage: File

    try {
      compressedImage = await imageCompression(imageFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      })
    } catch (error) {
      console.error(error)
      editor.send({ type: 'update readOnly', readOnly: false })
      return
    }

    const imageReferences = await uploadImagesToSanity([compressedImage], {
      sizeLimit: () => {
        // If we get to this point and our request body hits the vercel limit of 4.5MB
        // then we should fail and let the user fix the images
        console.error('Size Limit on uploading images')
      },
      error: () => {
        // Some other error happened
        console.error('There was a problem uploading images.')
      },
    })

    if (
      imageReferences === 'SizeLimitError' ||
      imageReferences === 'GeneralError'
    ) {
      editor.send({ type: 'update readOnly', readOnly: false })
      return
    }

    // Trigger 'editable' event in the editor to disable loading state
    // This needs to happen before we insert the image block object
    editor.send({ type: 'update readOnly', readOnly: false })

    editor.send({
      type: 'insert.block object',
      blockObject: {
        name: 'image',
        value: imageReferences[0],
      },
      placement: 'auto',
    })

    editor.send({ type: 'focus' })
  }

  return (
    <FileButton
      onChange={onImageUpload}
      accept={ACCEPTED_IMAGE_TYPES.join(',')}
    >
      {(props) => (
        <BaseToolbarButton {...props} leftSection={imageIcon} isActive={false}>
          Upload Image
        </BaseToolbarButton>
      )}
    </FileButton>
  )
}

export default ImageButton
