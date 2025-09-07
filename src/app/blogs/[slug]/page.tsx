import { Stack } from '@mantine/core'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'

import MinimalArtistCard from '~/components/ArtistCard/MinimalArtistCard'
import { Blog } from '~/components/Blog'
import MailingList from '~/components/MailingList/MailingList'
import { PortableTextComponents } from '~/components/PortableTextComponents/PortableTextComponents'
import {
  getBlogBySlug,
  getPublishedBlogs,
} from '~/lib/sanity/queries/sanity.blogsQuery'
import { getDefaultMailingList } from '~/lib/sanity/queries/sanity.mailingListQuery'
import { getLayoutMetadata } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'
import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { resolveArtistUrl } from '~/lib/sanity/sanity.links'
import { NavigationPages } from '~/utils/navigation'

export const generateStaticParams = async () => {
  const client = getClient(undefined)
  const blogs = await getPublishedBlogs(client)
  return blogs?.map((b) => ({ slug: b.slug.current })) || []
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
  // When we have an artist specific mailing list, we should get that here.
  const mailingListContent = await getDefaultMailingList()

  if (!blog || blog.state !== 'published') return notFound()

  const image = getImageFromRef(blog.coverImage)
  const authorName = blog.artist?.name || 'Unknown'
  const authorUrl = blog.artist?.isActive
    ? `${NavigationPages.Artists}/${encodeURIComponent(resolveArtistUrl(blog.artist))}`
    : NavigationPages.Artists

  return (
    <Blog coverImage={{ url: image?.url, alt: image?.altText || blog.title }}>
      <Stack component="header" gap="lg" justify="center" align="center">
        <Blog.Title title={blog.title} />
        <Blog.PublishInfo
          authorName={authorName}
          authorUrl={authorUrl}
          publishedAt={blog.publishedAt}
        />
        <Blog.ShareButton title={blog.title} />
      </Stack>

      <Blog.Content>
        <PortableText
          value={blog.content}
          components={PortableTextComponents}
        />
      </Blog.Content>

      <Blog.ShareButton title={blog.title} mb="lg" p={0} />
      <MinimalArtistCard
        artist={blog.artist}
        showPortfolioLink
        mb={{ base: 50, sm: 75, md: 100 }}
      />
      <MailingList content={mailingListContent} />
    </Blog>
  )
}

export default BlogPostPage
