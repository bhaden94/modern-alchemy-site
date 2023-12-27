import PageContainer from '~/components/Container'
import Hero from '~/components/Hero/Hero'
import { getRootPageContent } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'

import Home from '../components/Home'

export default async function RootPage() {
  const client = getClient(undefined)
  const content = await getRootPageContent(client)

  if (!content) return undefined

  return (
    <>
      <Hero title={content.heroTitle} description={content.heroDescription} />
      <PageContainer>
        <Home content={content.homeContent} />
      </PageContainer>
    </>
  )
}
