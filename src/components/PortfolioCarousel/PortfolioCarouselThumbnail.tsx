import Image from 'next/image'
import { ImageAsset } from 'sanity'

import { generateNextImagePlaceholder } from '~/utils'

interface IPortfolioCarouselThumbnail {
  image: ImageAsset
  selected: boolean
  index: number
  onClick: (index: number) => void
}

const PortfolioCarouselThumbnail = ({
  image,
  selected,
  index,
  onClick,
}: IPortfolioCarouselThumbnail) => {
  return (
    <Image
      className={`${
        selected
          ? 'border-[var(--mantine-primary-color-filled)] opacity-100'
          : 'opacity-20'
      } rounded-md border-solid cursor-pointer transition duration-300 ease-in-out`}
      src={image.url}
      alt="Portfolio image thumbnail"
      onClick={() => onClick(index)}
      width={75}
      height={75}
      placeholder={generateNextImagePlaceholder(75, 75, 'xs')}
    />
  )
}

export default PortfolioCarouselThumbnail
