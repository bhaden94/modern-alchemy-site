import {
  SanityImageAsset,
  SanityImageSource,
  tryGetImageAsset,
} from '@sanity/asset-utils'
import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

import { dataset, projectId } from '~/lib/sanity/sanity.api'
import { ImageReference } from '~/utils/images/uploadImagesToSanity'

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

export const getImageFromRef = (
  imageRef?: ImageReference | SanityImageSource | string | null,
): SanityImageAsset | undefined => {
  if (imageRef && typeof imageRef === 'string') {
    // If the imageRef is a string, it means we are passing in the _key
    // Convert to an image reference object
    imageRef = { _type: 'image', asset: { _ref: imageRef, _type: 'reference' } }
  }

  return imageRef
    ? tryGetImageAsset(imageRef, { projectId: projectId, dataset: dataset })
    : undefined
}
