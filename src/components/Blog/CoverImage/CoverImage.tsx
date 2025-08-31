import { Overlay } from '@mantine/core'
import classes from './CoverImage.module.css'
import Image from 'next/image'
import { generateNextImagePlaceholder } from '~/utils'

const CoverImage = ({ image }: { image: { url: string; alt: string } }) => (
  <div className={classes.wrapper}>
    <Image
      src={image.url}
      alt={image.alt}
      fill
      sizes="100vw"
      className={classes.image}
      placeholder={generateNextImagePlaceholder(500, 500)}
    />
    <Overlay color="#000" backgroundOpacity={0.35} />
  </div>
)

export default CoverImage
