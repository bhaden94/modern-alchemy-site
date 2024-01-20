import { notFound } from 'next/navigation'

import Hero from '~/components/Hero/Hero'
import PageContainer from '~/components/PageContainer'
import { getRootPageContent } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'

import Home from '../components/Home'

export default async function RootPage() {
  const client = getClient(undefined)
  const content = await getRootPageContent(client)

  if (!content) return notFound()

  return (
    <>
      <Hero
        title={content.pageTitle}
        description={content.heroDescription}
        buttonText={content.heroButtonText}
        buttonLink={content.heroButtonLink}
      />
      {/* <PageContainer>
        <Home content={content.homeContent} />
      </PageContainer> */}
    </>
  )
}
