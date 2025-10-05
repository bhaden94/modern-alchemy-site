import { notFound } from 'next/navigation'

import { BlogList } from '~/components/BlogList/BlogList'
import PageContainer from '~/components/PageContainer'
import PageInProgress from '~/components/PageInProgress/PageInProgress'
import PageTitle from '~/components/PageTitle/PageTitle'
import { getPublishedBlogs } from '~/lib/sanity/queries/sanity.blogsQuery'
import { performPageContentQuery } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'

// TODO metadata for page setup

export default async function Page() {
  const client = getClient()
  const content = await performPageContentQuery('blogPageContent')
  const blogs = await getPublishedBlogs(client)

  if (!content) return notFound()

  if (!content.isActive || blogs?.length === 0) {
    return <PageInProgress />
  }

  return (
    <PageContainer>
      <PageTitle title={content.pageTitle} />
      <BlogList blogs={blogs || []} />
    </PageContainer>
  )
}
