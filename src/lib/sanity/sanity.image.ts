import {
  SanityImageAsset,
  SanityImageSource,
  tryGetImageAsset,
} from '@sanity/asset-utils'
import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

import { dataset, projectId } from '~/lib/sanity/sanity.api'

export type ImageReference = {
  _key?: string
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

export const IMAGE_QUERY = `
...,
_type == "image" => {
  ...,
  asset->
}`

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlForImage = (source: Image) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined
  }

  return imageBuilder?.image(source).auto('format')
}

/*
 * Normalize an image reference to a consistent format.
 */
export const normalizeImageReference = (
  image: ImageReference | { _key: string; _type: 'image' } | string | unknown,
): ImageReference | null => {
  if (typeof image === 'string') {
    // Assume string is the _key
    return {
      _key: image,
      _type: 'image',
      asset: { _ref: image, _type: 'reference' },
    }
  }

  if (typeof image === 'object' && image !== null) {
    if (
      'asset' in image &&
      image.asset &&
      typeof image.asset === 'object' &&
      image.asset !== null &&
      '_ref' in image.asset
    ) {
      // Already a valid image reference
      // and image._key could be different from image.asset._ref
      return image as ImageReference
    }

    if ('_key' in image && image._key && typeof image._key === 'string') {
      // Create a new reference from _key
      return {
        _key: image._key,
        _type: 'image',
        asset: { _ref: image._key, _type: 'reference' },
      }
    }
  }

  return null
}

export const getImageFromRef = (
  imageRef?: ImageReference | SanityImageSource | string | null,
): (SanityImageAsset & { altText?: string }) | undefined => {
  if (imageRef && typeof imageRef === 'string') {
    // If the imageRef is a string, it means we are passing in the _key
    // Convert to an image reference object
    imageRef = { _type: 'image', asset: { _ref: imageRef, _type: 'reference' } }
  }

  return imageRef
    ? tryGetImageAsset(imageRef, { projectId: projectId, dataset: dataset })
    : undefined
}

export const uploadImagesToSanity = async (
  images: File[],
  errorCallbacks?: { error?: () => void; sizeLimit?: () => void },
): Promise<ImageReference[] | 'GeneralError' | 'SizeLimitError'> => {
  const formData = new FormData()
  Array.from(images).forEach((file, i) => {
    formData.append(`image-${i}`, file)
  })

  /* Upload images */
  const imageUploadResponse = await fetch('/api/sanity/images', {
    method: 'PUT',
    body: formData,
  })

  if (imageUploadResponse.status === 413) {
    // If we get to this point and our request body hits the vercel limit of 4.5MB
    // then we should fail and let the user fix the images
    errorCallbacks?.sizeLimit && errorCallbacks.sizeLimit()
    return 'SizeLimitError'
  }

  if (!imageUploadResponse.ok) {
    errorCallbacks?.error && errorCallbacks.error()
    return 'GeneralError'
  }

  const imageJson = await imageUploadResponse.json()
  return imageJson.imageReferences
}

export const deleteImagesFromSanity = async (imageIds: string[]) => {
  if (!Array.isArray(imageIds) || imageIds.length === 0) {
    throw new Error('Invalid image keys')
  }

  return await fetch('/api/sanity/images', {
    method: 'DELETE',
    body: JSON.stringify({ imageIds }),
  })
}
