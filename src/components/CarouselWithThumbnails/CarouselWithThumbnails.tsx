'use client'

import { Carousel, CarouselProps, Embla } from '@mantine/carousel'
import { Stack } from '@mantine/core'
import { useCallback, useEffect, useState } from 'react'

import { ImageReference } from '~/utils/images/uploadImagesToSanity'

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
  imageRefs: ImageReference[]
}

const CarouselWithThumbnails = ({ imageRefs }: ICarouselWithThumbnails) => {
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

  const mainImageSlides = imageRefs?.map((image) => (
    <Carousel.Slide key={image._key}>
      <CarouselImage imageRef={image} />
    </Carousel.Slide>
  ))

  const thumbnails = imageRefs?.map((image, i) => (
    <Carousel.Slide key={image._key}>
      <CarouselThumbnail
        imageRef={image}
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
        withControls={imageRefs.length > 1}
      >
        {mainImageSlides}
      </Carousel>
      {Boolean(imageRefs.length > 1) && (
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
