'use client'

import { Carousel, CarouselProps, Embla } from '@mantine/carousel'
import { Stack } from '@mantine/core'
import { useCallback, useEffect, useState } from 'react'
import { ImageAsset } from 'sanity'

import CarouselImage from './CarouselImage/CarouselImage'
import CarouselThumbnail from './CarouselThumbnail/CarouselThumbnail'
import classes from './CarouselWithThumbnails.module.css'

const sharedCarouselProps: Partial<CarouselProps> = {
  controlsOffset: 'xs',
  height: '100%',
  align: 'center',
  loop: true,
  classNames: { controls: classes.controls },
}

interface ICarouselWithThumbnails {
  images: { asset: ImageAsset }[]
}

const CarouselWithThumbnails = ({ images }: ICarouselWithThumbnails) => {
  const [embla, setEmbla] = useState<Embla | null>(null)
  const [emblaThumbs, setEmblaThumbs] = useState<Embla | null>(null)
  const [thumbIndex, setThumbIndex] = useState<number>(0)

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

  const mainImageSlides = images?.map((image) => (
    <Carousel.Slide key={image.asset._id}>
      <CarouselImage image={image.asset} />
    </Carousel.Slide>
  ))

  const thumbnails = images?.map((image, i) => (
    <Carousel.Slide key={image.asset._id}>
      <CarouselThumbnail
        image={image.asset}
        selected={i === thumbIndex}
        index={i}
        onClick={scrollTo}
      />
    </Carousel.Slide>
  ))

  return (
    <Stack gap={8} h="100%" mih={475}>
      <Carousel
        {...sharedCarouselProps}
        classNames={{ root: classes.mainCarouselRoot }}
        getEmblaApi={setEmbla}
        withControls={images.length > 1}
      >
        {mainImageSlides}
      </Carousel>
      {Boolean(images.length > 1) && (
        <Carousel
          {...sharedCarouselProps}
          getEmblaApi={setEmblaThumbs}
          dragFree
          slideSize="10%"
          slideGap={3}
        >
          {thumbnails}
        </Carousel>
      )}
    </Stack>
  )
}

export default CarouselWithThumbnails
