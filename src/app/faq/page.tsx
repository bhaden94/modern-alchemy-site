import PageContainer from '~/components/Container'
import Faqs from '~/components/Faqs/Faqs'
import { getFaqPageContent } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'

const FaqPage = async () => {
  const client = getClient(undefined)
  const content = await getFaqPageContent(client)

  if (!content) return undefined

  return (
    <PageContainer>
      <Faqs {...content} />
    </PageContainer>
  )
}

export default FaqPage
