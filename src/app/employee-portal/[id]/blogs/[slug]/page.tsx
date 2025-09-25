import AdminBlogEditor from '~/components/AdminControls/AdminBlogEditor/AdminBlogEditor'
import PageContainer from '~/components/PageContainer'
import { getBlogBySlug } from '~/lib/sanity/queries/sanity.blogsQuery'
import { getClient } from '~/lib/sanity/sanity.client'

interface PageParams {
  params: {
    id: string
    slug: string
  }
}

export default async function Page({ params }: PageParams) {
  const client = getClient()
  const blog = await getBlogBySlug(client, params.slug)

  if (!blog) {
    return (
      <PageContainer>
        <div>Blog not found.</div>
      </PageContainer>
    )
  }

  return <AdminBlogEditor documentId={blog._id} blog={blog} />
}
