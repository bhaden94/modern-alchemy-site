import Image from 'next/image'
import { ImageAsset } from 'sanity'

import { generateNextImagePlaceholder } from '~/utils'

import classes from '../CarouselWithThumbnails.module.css'

interface ICarouselThumbnail {
  image: ImageAsset
  selected: boolean
  index: number
  onClick: (index: number) => void
}

const CarouselThumbnail = ({
  image,
  selected,
  index,
  onClick,
}: ICarouselThumbnail) => {
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
