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
import { generateArticleSchema, generateEnhancedMetadata } from '~/utils/seo'

export const generateStaticParams = async () => {
  const client = getClient(undefined)
  const blogs = await getPublishedBlogs(client)

  return blogs.map((b) => ({ slug: b.slug?.current })).filter((b) => b.slug)
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const client = getClient(undefined)
  const blog = await getBlogBySlug(client, decodeURI(params.slug))
  if (!blog) return {}
  const layout = await getLayoutMetadata(client)

  const title = blog.title || 'Blog Post'
  const locationParts = [layout.city, layout.state].filter(Boolean).join(', ')
  const description = `Read ${title} at ${layout.businessName}${locationParts ? ` in ${locationParts}` : ''}.`

  const blogImageUrl = getImageFromRef(blog.coverImage)?.url

  // Generate Article structured data
  const articleSchema = generateArticleSchema(
    title,
    description,
    blog.artist?.name || layout.businessName,
    blog.publishedAt || blog._createdAt,
    blogImageUrl,
    `${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${params.slug}`,
  )

  return {
    ...generateEnhancedMetadata({
      title,
      description,
      imageUrl: blogImageUrl,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${params.slug}`,
      type: 'article',
      siteName: layout.businessName,
      keywords: [
        'tattoo blog',
        title,
        layout.businessName,
        layout.city || '',
      ].filter(Boolean),
    }),
    other: {
      'application/ld+json': JSON.stringify(articleSchema),
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
