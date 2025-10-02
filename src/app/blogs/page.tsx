import { notFound } from 'next/navigation'

import { BlogList } from '~/components/BlogList/BlogList'
import PageContainer from '~/components/PageContainer'
import PageTitle from '~/components/PageTitle/PageTitle'
import { getPublishedBlogs } from '~/lib/sanity/queries/sanity.blogsQuery'
import { getLayoutMetadata } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'

// TODO metadata for page setup

export default async function Page() {
  const client = getClient()
  const blogs = await getPublishedBlogs(client)
  const layoutMetadata = await getLayoutMetadata(client)

  if (!blogs) {
    return notFound()
  }

  return (
    <PageContainer>
      <PageTitle title={`${layoutMetadata.businessName} Blog`} />
      <BlogList blogs={blogs} />
    </PageContainer>
  )
}
