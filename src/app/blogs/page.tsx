import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogList } from '~/components/BlogList/BlogList'
import PageContainer from '~/components/PageContainer'
import PageInProgress from '~/components/PageInProgress/PageInProgress'
import PageTitle from '~/components/PageTitle/PageTitle'
import { getPublishedBlogs } from '~/lib/sanity/queries/sanity.blogsQuery'
import {
  getLayoutMetadata,
  performPageContentQuery,
} from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'
import { getImageFromRef } from '~/lib/sanity/sanity.image'

export async function generateMetadata(): Promise<Metadata> {
  const client = getClient(undefined)
  const layout = await getLayoutMetadata(client)

  const title = 'Blogs'
  const description = `Explore ${layout.businessName}'s latest artist spotlights, studio news, tattoo inspiration, aftercare tips, and culture stories—updated regularly.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: getImageFromRef(layout.openGraphImage)?.url,
    },
  }
}

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
