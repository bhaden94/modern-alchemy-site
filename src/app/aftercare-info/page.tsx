import { notFound } from 'next/navigation'

import AftercareInfo from '~/components/AftercareInfo/AftercareInfo'
import PageContainer from '~/components/PageContainer'
import PageInProgress from '~/components/PageInProgress/PageInProgress'
import { getAftercareInfoPageContent } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'

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
