import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import GeneralPage from '~/components/GeneralPage/GeneralPage'
import PageContainer from '~/components/PageContainer'
import PageInProgress from '~/components/PageInProgress/PageInProgress'
import { getAftercareInfoPageContent } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'

export async function generateMetadata(): Promise<Metadata> {
  const client = getClient(undefined)
  const content = await getAftercareInfoPageContent(client)
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
  const client = getClient(undefined)
  const content = await getAftercareInfoPageContent(client)

  if (!content) return notFound()

  if (!content.isActive) {
    return <PageInProgress />
  }

  // console.log(content)

  return (
    <PageContainer>
      <GeneralPage {...content} />
    </PageContainer>
  )
}

export default AftercareInfoPage
