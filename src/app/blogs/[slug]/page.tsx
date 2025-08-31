import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'

import PageContainer from '~/components/PageContainer'
import PageTitle from '~/components/PageTitle/PageTitle'
import {
  getBlogBySlug,
  getPublishedBlogs,
} from '~/lib/sanity/queries/sanity.blogsQuery'
import { getLayoutMetadata } from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'
import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { Container } from '@mantine/core'
import CoverImage from '~/components/Blog/CoverImage/CoverImage'

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
    <>
      {image?.url && <CoverImage image={{ url: image.url, alt: blog.title }} />}
      <PageContainer>
        <Container size="xs" px={0}>
          <PageTitle title={blog.title} />
          <article>
            <PortableText value={blog.content} />
          </article>
        </Container>
      </PageContainer>
    </>
  )
}

export default BlogPostPage
