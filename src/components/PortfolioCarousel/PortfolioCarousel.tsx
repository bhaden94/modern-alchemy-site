'use client'

import { Carousel, Embla } from '@mantine/carousel'
import Image from 'next/image'
import { useState } from 'react'
import { ImageAsset } from 'sanity'

const PortfolioCarousel = ({ images }: { images: { asset: ImageAsset }[] }) => {
  const [embla, setEmbla] = useState<Embla | null>(null)
  const [thumbIndex, setThumbIndex] = useState<number>(0)

  const scrollTo = (index: number) => {
    if (embla) {
      embla.scrollTo(index)
      setThumbIndex(index)
    }
  }

  return (
    <div className="flex flex-wrap">
      <div className=" flex w-full h-[400px]">
        <Carousel
          height="100%"
          className="flex-1"
          align="center"
          getEmblaApi={setEmbla}
          withIndicators
          loop
        >
          {images?.map((image) => (
            <Carousel.Slide key={image.asset.originalFilename}>
              <Image
                src={image.asset.url}
                alt="Portfolio image thumbnail"
                fill
                style={{
                  objectFit: 'contain',
                }}
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
      <div className="w-full">
        {images?.map((image, i) => (
          <Image
            src={image.asset.url}
            key={image.asset.originalFilename}
            alt="Portfolio image thumbnail"
            onClick={() => scrollTo(i)}
            width={75}
            height={75}
          />
        ))}
      </div>
    </div>
  )
}

export default PortfolioCarousel
