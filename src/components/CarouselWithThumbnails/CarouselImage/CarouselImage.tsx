'use client'

import Image from 'next/image'
import { ImageAsset } from 'sanity'

import { generateNextImagePlaceholder } from '~/utils'

interface ICarouselImage {
  image: ImageAsset
}

const CarouselImage = ({ image }: ICarouselImage) => {
  return (
    <Image
      src={image.url}
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
