import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import Faqs from '~/components/Faqs/Faqs'
import PageContainer from '~/components/PageContainer'
import PageInProgress from '~/components/PageInProgress/PageInProgress'
import { performPageContentQuery } from '~/lib/sanity/queries/sanity.pageContentQueries'

export async function generateMetadata(): Promise<Metadata> {
  const content = await performPageContentQuery('faqPageContent')
  if (!content) return {}

  return {
    title: content.pageTitle,
    description: content.metadataDescription,
    openGraph: {
      title: content.pageTitle,
      description: content.metadataDescription,
    },
  }
}

const FaqPage = async () => {
  const content = await performPageContentQuery('faqPageContent')

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
