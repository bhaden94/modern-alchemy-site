'use client'

import Image from 'next/image'
import { ImageAsset } from 'sanity'

import { generateNextImagePlaceholder } from '~/utils'

interface IPortfolioCarouselImage {
  image: ImageAsset
}

const PortfolioCarouselImage = ({ image }: IPortfolioCarouselImage) => {
  return (
    <Image
      src={image.url}
      alt="Portfolio image thumbnail"
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

export default PortfolioCarouselImage
