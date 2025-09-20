import { Overlay } from '@mantine/core'
import Image from 'next/image'

import { generateNextImagePlaceholder } from '~/utils'

import classes from './CoverImage.module.css'

interface ICoverImage {
  image: { url: string; alt: string }
  overlayZIndex?: number
}

const CoverImage = ({ image, overlayZIndex }: ICoverImage) => (
  <div className={classes.wrapper}>
    <Image
      src={image.url}
      alt={image.alt}
      fill
      sizes="100vw"
      className={classes.image}
      placeholder={generateNextImagePlaceholder(500, 500)}
    />
    <Overlay color="#000" backgroundOpacity={0.35} zIndex={overlayZIndex} />
  </div>
)

export default CoverImage
