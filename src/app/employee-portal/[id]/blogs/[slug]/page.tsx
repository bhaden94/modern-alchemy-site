import AdminBlogEditorContent from '~/components/AdminControls/AdminBlogEditor/AdminBlogEditorContent'
import PageContainer from '~/components/PageContainer'
import { getBlogBySlug } from '~/lib/sanity/queries/sanity.blogsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { getImageFromRef } from '~/lib/sanity/sanity.image'

interface PageParams {
  params: {
    id: string
    slug: string
  }
}

export default async function Page({ params }: PageParams) {
  const client = getClient()
  const blog = await getBlogBySlug(client, params.slug)
  const coverImage = getImageFromRef(blog.coverImage)

  if (!blog) {
    return (
      <PageContainer>
        <div>Blog not found.</div>
      </PageContainer>
    )
  }

  return (
    <AdminBlogEditorContent
      documentId={blog._id}
      initialTitle={blog.title}
      initialContent={blog.content}
      initialCoverImage={{
        url: coverImage?.url,
        alt: coverImage?.altText || blog.title,
      }}
    />
  )
}
