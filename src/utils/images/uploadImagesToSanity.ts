export type ImageReference = {
  _key?: string
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

const uploadImagesToSanity = async (
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

export default uploadImagesToSanity
