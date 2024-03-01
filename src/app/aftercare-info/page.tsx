import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import AftercareInfo from '~/components/AftercareInfo/AftercareInfo'
import PageContainer from '~/components/PageContainer'
import PageInProgress from '~/components/PageInProgress/PageInProgress'
import { getAftercareInfoPageContent } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'

export const metadata: Metadata = {
  title: 'Aftercare Information',
  description:
    "Learn essential tips and guidelines for tattoo aftercare with Modern Alchemy Tattoo Company's comprehensive guide. Discover the best practices to ensure the longevity and vibrant appearance of your new tattoo.",
  openGraph: {
    title: 'Aftercare Information',
  },
}

const AftercareInfoPage = async () => {
  const client = getClient(undefined)
  const content = await getAftercareInfoPageContent(client)

  if (!content) return notFound()

  if (!content.isActive) {
    return <PageInProgress />
  }

  return (
    <PageContainer>
      <AftercareInfo {...content} />
    </PageContainer>
  )
}

export default AftercareInfoPage
