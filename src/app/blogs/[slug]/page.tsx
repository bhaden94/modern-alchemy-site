import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'

import {
  getBlogBySlug,
  getPublishedBlogs,
} from '~/lib/sanity/queries/sanity.blogsQuery'
import { getLayoutMetadata } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'
import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { Blog } from '~/components/Blog'
import { NavigationPages } from '~/utils/navigation'
import { resolveArtistUrl } from '~/lib/sanity/sanity.links'

export const generateStaticParams = async () => {
  const client = getClient(undefined)
  const blogs = await getPublishedBlogs(client)
  return blogs?.map((b) => ({ slug: b.slug.current }))
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

  if (!blog || blog.state !== 'published') return notFound()

  const image = getImageFromRef(blog.coverImage)

  return (
    <Blog coverImage={{ url: image?.url, alt: blog.title }}>
      <Blog.Header
        title={blog.title}
        authorName={blog.artist?.name || 'Unknown'}
        authorUrl={`${NavigationPages.Artists}/${encodeURIComponent(resolveArtistUrl(blog.artist))}`}
        publishedAt={blog.publishedAt}
      />
      <article>
        <PortableText value={blog.content} />
      </article>
    </Blog>
  )
}

export default BlogPostPage
