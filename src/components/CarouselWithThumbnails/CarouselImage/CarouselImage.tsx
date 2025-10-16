'use client'

import Image from 'next/image'

import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { ImageReference } from '~/lib/sanity/sanity.image'
import { generateNextImagePlaceholder } from '~/utils'

interface ICarouselImage {
  imageRef: ImageReference
}

const CarouselImage = ({ imageRef }: ICarouselImage) => {
  const image = getImageFromRef(imageRef)
  if (!image) return undefined

  return (
    <Image
      src={getImageFromRef(image)?.url || ''}
      alt="Portfolio image"
      fill
      sizes="100%"
      style={{
        objectFit: 'contain',
      }}
      placeholder={generateNextImagePlaceholder(
        image.metadata.dimensions.width,
        image.metadata.dimensions.height,
      )}
    />
  )
}

export default CarouselImage
