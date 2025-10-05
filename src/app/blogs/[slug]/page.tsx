import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import BlogPage from '~/components/Blog/BlogPage'
import {
  getBlogBySlug,
  getPublishedBlogs,
} from '~/lib/sanity/queries/sanity.blogsQuery'
import { getDefaultMailingList } from '~/lib/sanity/queries/sanity.mailingListQuery'
import { getLayoutMetadata } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'
import { getImageFromRef } from '~/lib/sanity/sanity.image'

// TODO: fix
// export const generateStaticParams = async () => {
//   const client = getClient(undefined)
//   const blogs = await getPublishedBlogs(client)
//   return (
//     blogs
//       .filter((b) => b.slug?.current)
//       // filter ensures we get only the blogs with a set slug
//       // This ensures we always generate a valid param
//       .map((b) => ({ slug: b.slug!.current })) || []
//   )
// }

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const client = getClient(undefined)
  const blog = await getBlogBySlug(client, decodeURI(params.slug))
  if (!blog) return {}
  const layout = await getLayoutMetadata(client)

  const title = blog.title
  const description = `Read ${blog.title} at ${layout.businessName}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: getImageFromRef(blog.coverImage)?.url,
    },
  }
}

const BlogPostPage = async ({ params }: { params: { slug: string } }) => {
  const client = getClient(undefined)
  const blog = await getBlogBySlug(client, decodeURI(params.slug))
  // When we have an artist specific mailing list, we should get that here.
  const mailingListContent = await getDefaultMailingList()

  if (!blog || blog.state !== 'published') return notFound()

  return <BlogPage blog={blog} mailingListContent={mailingListContent} />
}

export default BlogPostPage
