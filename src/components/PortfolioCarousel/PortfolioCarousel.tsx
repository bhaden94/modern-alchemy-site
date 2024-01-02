'use client'

import { Carousel, CarouselProps, Embla } from '@mantine/carousel'
import { useCallback, useEffect, useState } from 'react'
import { ImageAsset } from 'sanity'

import PortfolioCarouselImage from './PortfolioCarouselImage'
import PortfolioCarouselThumbnail from './PortfolioCarouselThumbnail'

const sharedCarouselProps: Partial<CarouselProps> = {
  controlsOffset: 'xs',
  height: '100%',
  align: 'center',
  loop: true,
}

const PortfolioCarousel = ({ images }: { images: { asset: ImageAsset }[] }) => {
  const [embla, setEmbla] = useState<Embla | null>(null)
  const [emblaThumbs, setEmblaThumbs] = useState<Embla | null>(null)
  const [thumbIndex, setThumbIndex] = useState<number>(0)

  const mainImageSlides = images?.map((image) => (
    <Carousel.Slide key={image.asset.originalFilename}>
      <PortfolioCarouselImage image={image.asset} />
    </Carousel.Slide>
  ))

  const thumbnails = images?.map((image, i) => (
    <Carousel.Slide
      key={image.asset.originalFilename}
      className="flex justify-center"
    >
      <PortfolioCarouselThumbnail
        image={image.asset}
        selected={i === thumbIndex}
        index={i}
        onClick={scrollTo}
        key={image.asset.originalFilename}
      />
    </Carousel.Slide>
  ))

  const onSelect = useCallback(() => {
    if (embla && emblaThumbs) {
      setThumbIndex(embla.selectedScrollSnap())
      emblaThumbs.scrollTo(embla.selectedScrollSnap())
    }
  }, [embla, emblaThumbs, setThumbIndex])

  const scrollTo = useCallback(
    (index: number) => {
      if (embla && emblaThumbs) {
        setThumbIndex(index)
        embla.scrollTo(index)
      }
    },
    [embla, emblaThumbs, setThumbIndex],
  )

  useEffect(() => {
    if (embla) {
      embla.on('select', onSelect)
      embla.on('reInit', onSelect)
    }
  }, [embla, onSelect])

  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex w-full h-[400px]">
        <Carousel
          {...sharedCarouselProps}
          className="flex-1"
          getEmblaApi={setEmbla}
        >
          {mainImageSlides}
        </Carousel>
      </div>
      <div className="flex w-full overflow-hidden">
        <Carousel
          {...sharedCarouselProps}
          className="w-full"
          getEmblaApi={setEmblaThumbs}
          dragFree
          slideSize="10%"
          slideGap={0}
        >
          {thumbnails}
        </Carousel>
      </div>
    </div>
  )
}

export default PortfolioCarousel
