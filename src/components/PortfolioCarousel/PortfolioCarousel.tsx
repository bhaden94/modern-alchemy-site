'use client'

import { Carousel, Embla } from '@mantine/carousel'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { ImageAsset } from 'sanity'

const PortfolioCarousel = ({ images }: { images: { asset: ImageAsset }[] }) => {
  const [embla, setEmbla] = useState<Embla | null>(null)
  const [thumbIndex, setThumbIndex] = useState<number>(0)

  const onSelect = useCallback(() => {
    if (embla) {
      setThumbIndex(embla.selectedScrollSnap())
    }
  }, [embla, setThumbIndex])

  const scrollTo = useCallback(
    (index: number) => {
      if (embla) {
        embla.scrollTo(index)
        setThumbIndex(index)
      }
    },
    [embla],
  )

  useEffect(() => {
    if (embla) {
      embla.on('select', onSelect)
      embla.on('reInit', onSelect)
    }
  }, [embla, onSelect])

  return (
    <div className="flex flex-wrap">
      <div className=" flex w-full h-[400px]">
        <Carousel
          height="100%"
          className="flex-1"
          align="center"
          getEmblaApi={setEmbla}
          loop
        >
          {images?.map((image) => (
            <Carousel.Slide key={image.asset.originalFilename}>
              <Image
                src={image.asset.url}
                alt="Portfolio image thumbnail"
                fill
                sizes="100%"
                style={{
                  objectFit: 'contain',
                }}
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
      <div className="flex gap-2 w-full">
        {images?.map((image, i) => (
          <Image
            className={`${
              i === thumbIndex
                ? 'border-[var(--mantine-primary-color-filled)]'
                : ''
            } rounded-md border-solid cursor-pointer transition duration-300 ease-in-out hover:opacity-50`}
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
