'use client'

import { ActionIcon, Image } from '@mantine/core'
import { FileWithPath } from '@mantine/dropzone'
import { IconX } from '@tabler/icons-react'
import NextImage from 'next/image'

interface IImageThumbnails {
  imageFiles: FileWithPath[]
  onImageRemove: (name: string) => void
}

const ImageThumbnails = ({ imageFiles, onImageRemove }: IImageThumbnails) => {
  const previewThumbnails = imageFiles?.map((file) => {
    const imageUrl = URL.createObjectURL(file)
    return (
      <div className="relative" key={file.name}>
        <Image
          component={NextImage}
          src={imageUrl}
          onLoad={() => {
            URL.revokeObjectURL(imageUrl)
          }}
          alt={file.name}
          width={75}
          height={75}
          w={75}
          h={75}
          radius="md"
          className="aspect-square"
        />
        <div className="absolute top-0 right-0">
          <ActionIcon
            aria-label="Remove image"
            radius="md"
            size="md"
            color="red"
            variant="subtle"
            onClick={() => onImageRemove(file.name)}
          >
            <IconX />
          </ActionIcon>
        </div>
      </div>
    )
  })

  return (
    <div className="flex flex-wrap gap-2 my-4 min-h-[75px]">
      {previewThumbnails}
    </div>
  )
}

export default ImageThumbnails
