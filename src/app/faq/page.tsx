import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import Faqs from '~/components/Faqs/Faqs'
import PageContainer from '~/components/PageContainer'
import PageInProgress from '~/components/PageInProgress/PageInProgress'
import { getFaqPageContent } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Find answers to common questions about tattoos at Modern Alchemy Tattoo Company. From the tattooing process to aftercare tips, our FAQ page addresses the most common inquiries.',
  openGraph: {
    title: 'Frequently Asked Questions',
  },
}

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
