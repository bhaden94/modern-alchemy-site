import Image from 'next/image'

import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { ImageReference } from '~/lib/sanity/sanity.image'
import { generateNextImagePlaceholder } from '~/utils'

import classes from '../CarouselWithThumbnails.module.css'

interface ICarouselThumbnail {
  imageRef: ImageReference
  selected: boolean
  index: number
  onClick: (index: number) => void
}

const CarouselThumbnail = ({
  imageRef,
  selected,
  index,
  onClick,
}: ICarouselThumbnail) => {
  const image = getImageFromRef(imageRef)
  if (!image) return undefined

  return (
    <Image
      className={classes.thumbnailImage}
      src={image.url}
      data-selected={selected}
      alt="Portfolio image thumbnail"
      onClick={() => onClick(index)}
      width={75}
      height={75}
      placeholder={generateNextImagePlaceholder(75, 75, 'xs')}
    />
  )
}

export default CarouselThumbnail
