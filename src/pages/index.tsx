import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import Link from 'next/link'
import { useEffect } from 'react'

import Card from '~/components/Card'
import Container from '~/components/Container'
import { Feature, FeatureType, useFeatures } from '~/components/FeatureProvider'
import TattooForm from '~/components/TattooForm'
import Welcome from '~/components/Welcome'
import { readToken, writeToken } from '~/lib/sanity/sanity.api'
import { getClient } from '~/lib/sanity/sanity.client'
import {
  getPosts,
  type Post,
  postsQuery,
  FeatureFlag,
  getFeatureFlags,
  listenForFeatureFlagChanges,
} from '~/lib/sanity/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    posts: Post[]
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const posts = await getPosts(client)

  return {
    props: {
      draftMode,
      token: writeToken,
      posts,
    },
  }
}

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

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const [posts] = useLiveQuery<Post[]>(props.posts, postsQuery)
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
  }, [])

  return (
    <Container>
      <section>
        {posts.length ? (
          posts.map((post) => <Card key={post._id} post={post} />)
        ) : (
          <Welcome />
        )}
        <Link href="/bookings">Bookings</Link>
        {features?.booksOpen ? (
          <TattooForm writeToken={props.token} />
        ) : undefined}
      </section>
    </Container>
  )
}
