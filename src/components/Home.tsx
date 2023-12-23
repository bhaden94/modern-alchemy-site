'use client'

import Link from 'next/link'

// import TattooForm from '~/components/TattooForm'
import Welcome from '~/components/Welcome'
import { useFeatures } from '~/hooks/useFeatures'

export default function Home() {
  const { features } = useFeatures()

  return (
    <section>
      {/* <Hero /> */}
      <Welcome />
      {/* <Link href="/bookings">Bookings</Link> */}
      {/* {features?.booksOpen ? <TattooForm /> : undefined} */}
    </section>
  )
}
