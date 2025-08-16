import { FileRejection, FileWithPath } from '@mantine/dropzone'
import imageCompression from 'browser-image-compression'
import { SetStateAction } from 'react'

export interface ImageHandlingSetters {
  compressSetter: (value: SetStateAction<boolean>) => void
  imageRejectionSetter: (value: SetStateAction<FileRejection[]>) => void
  imageFilesSetter: (value: SetStateAction<FileWithPath[]>) => void
}

export interface ImageHandlingCallbacks {
  onFailure: (message?: string) => void
  clearFieldError?: (fieldId: string) => void
  setFormValues?: (values: { [key: string]: any }) => void
}

/**
 * Shared image drop handler for both tattoo and generic booking forms
 */
export const handleImageDrop = async (
  files: FileWithPath[],
  formId: string,
  setters: ImageHandlingSetters,
  callbacks: ImageHandlingCallbacks,
) => {
  setters.compressSetter(true)
  callbacks.clearFieldError?.(formId)
  setters.imageRejectionSetter([])
  setters.imageFilesSetter([])

  try {
    const filesPromises = files.map((file) =>
      imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      }),
    )
    const compressedImages = await Promise.all(filesPromises)

    setters.imageFilesSetter(compressedImages)
    callbacks.setFormValues?.({ [formId]: compressedImages })
  } catch (error) {
    callbacks.onFailure(
      'There was a problem compressing the images. Please try again. If the issue persists, please try different images.',
    )
  }

  setters.compressSetter(false)
}

/**
 * Shared image rejection handler
 */
export const handleImageReject = (
  rejections: FileRejection[],
  imageUploadSetter: (value: SetStateAction<FileRejection[]>) => void,
) => {
  imageUploadSetter(rejections)
}

/**
 * Shared image removal handler
 */
export const handleImageRemove = (
  nameToRemove: string,
  formId: string,
  images: FileWithPath[],
  imagesSetter: (value: SetStateAction<FileWithPath[]>) => void,
  setFormValues?: (values: { [key: string]: any }) => void,
) => {
  const filteredFiles = images.filter((image) => image.name !== nameToRemove)
  imagesSetter(filteredFiles)
  setFormValues?.({ [formId]: filteredFiles })
}
