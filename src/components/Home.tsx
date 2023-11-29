'use client'

import Link from 'next/link'
import { useLiveQuery } from 'next-sanity/preview'
import { useEffect } from 'react'

import Card from '~/components/Card'
import Container from '~/components/Container'
import { Feature, FeatureType, useFeatures } from '~/components/FeatureProvider'
import TattooForm from '~/components/TattooForm'
import Welcome from '~/components/Welcome'
import { writeToken } from '~/lib/sanity/sanity.api'
import { getClient } from '~/lib/sanity/sanity.client'
import {
  FeatureFlag,
  getFeatureFlags,
  listenForFeatureFlagChanges,
  type Post,
  postsQuery,
} from '~/lib/sanity/sanity.queries'

function createProviderFlags(flags: FeatureFlag[]): FeatureType {
  let flagsObj: FeatureType = {
    [Feature.BooksOpen]: false,
  }

  flags.forEach((feature: FeatureFlag) => {
    const key = feature.key
    const status = feature.status
    flagsObj[key] = status
  })

  return flagsObj
}

export default function Home({ postsList }: { postsList: Post[] }) {
  const [posts] = useLiveQuery<Post[]>(postsList, postsQuery)
  const { features, setFeatureFlags } = useFeatures()

  useEffect(() => {
    const client = getClient(undefined)
    const fetchFeatureFlags = async () => {
      const featureFlags = await getFeatureFlags(client)
      const flags = createProviderFlags(featureFlags)
      setFeatureFlags(flags)
    }

    fetchFeatureFlags()

    const subscription = listenForFeatureFlagChanges(client).subscribe(
      (update: { result: FeatureFlag }) => {
        let currentFeatures = { ...features }
        if (currentFeatures) {
          currentFeatures[update?.result?.key || 'missingKey'] =
            update?.result?.status || false
          setFeatureFlags(currentFeatures)
        }
      },
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [features, setFeatureFlags])

  return (
    <Container>
      <section>
        {posts.length ? (
          posts.map((post) => <Card key={post._id} post={post} />)
        ) : (
          <Welcome />
        )}
        <Link href="/bookings">Bookings</Link>
        {features?.booksOpen ? <TattooForm /> : undefined}
      </section>
    </Container>
  )
}
