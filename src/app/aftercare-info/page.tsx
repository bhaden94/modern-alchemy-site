import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import GeneralPage from '~/components/GeneralPage/GeneralPage'
import PageContainer from '~/components/PageContainer'
import PageInProgress from '~/components/PageInProgress/PageInProgress'
import { performPageContentQuery } from '~/lib/sanity/queries/sanity.pageContentQueries'

export async function generateMetadata(): Promise<Metadata> {
  const content = await performPageContentQuery('aftercareInfoPageContent')
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

const AftercareInfoPage = async () => {
  const content = await performPageContentQuery('aftercareInfoPageContent')

  if (!content) return notFound()

  if (!content.isActive) {
    return <PageInProgress />
  }

  return (
    <PageContainer>
      <GeneralPage {...content} />
    </PageContainer>
  )
}

export default AftercareInfoPage
