import { notFound } from 'next/navigation'

import Faqs from '~/components/Faqs/Faqs'
import PageContainer from '~/components/PageContainer'
import PageInProgress from '~/components/PageInProgress/PageInProgress'
import { getFaqPageContent } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'

const FaqPage = async () => {
  const client = getClient(undefined)
  const content = await getFaqPageContent(client)

  if (!content) return notFound()

  if (!content.isActive) {
    return <PageInProgress />
  }

  return (
    <PageContainer>
      <Faqs {...content} />
    </PageContainer>
  )
}

export default FaqPage
