import { notFound } from 'next/navigation'

import Hero from '~/components/Hero/Hero'
import { getRootPageContent } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'

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
