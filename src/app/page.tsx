import { getClient } from '~/lib/sanity/sanity.client'
import { getPosts } from '~/lib/sanity/sanity.queries'

import Home from '../components/Home'
import Providers from '../components/Providers'

export default async function RootPage() {
  const client = getClient(undefined)
  const posts = await getPosts(client)

  return (
    <Providers>
      <Home postsList={posts} />
    </Providers>
  )
}
