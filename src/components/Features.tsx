'use client'

import { useState } from 'react'
import { useFeatures } from '~/hooks/useFeatures'
import { Feature } from '~/types/FeatureEnum'

export default function Features() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { features } = useFeatures()

  const updateFeatureFlag = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsSubmitting(true)

    const response = await fetch('/api/sanity/feature', {
      method: 'PATCH',
      body: JSON.stringify({
        key: Feature.BooksOpen,
        status: event.target.checked,
      }),
    })
    // TODO: handle errors

    setIsSubmitting(false)
  }

  return (
    <section>
      {features ? (
        <>
          <label htmlFor="books_open">Books Open</label>
          <input
            type="checkbox"
            id="books_open"
            checked={features[Feature.BooksOpen]}
            onChange={updateFeatureFlag}
            disabled={isSubmitting}
          />
        </>
      ) : undefined}
    </section>
  )
}
