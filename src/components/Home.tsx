'use client'

import Link from 'next/link'

import Container from '~/components/Container'
import { useFeatures } from '~/components/FeatureProvider'
import TattooForm from '~/components/TattooForm'
import Welcome from '~/components/Welcome'

export default function Home() {
  const { features } = useFeatures()

  return (
    <Container>
      <section>
        <Welcome />
        <Link href="/bookings">Bookings</Link>
        {features?.booksOpen ? <TattooForm /> : undefined}
      </section>
    </Container>
  )
}
