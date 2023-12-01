import { getClient } from '~/lib/sanity/sanity.client'
import { getPosts } from '~/lib/sanity/sanity.queries'

import Home from '../components/Home'

export default async function RootPage() {
  return <Home />
}
