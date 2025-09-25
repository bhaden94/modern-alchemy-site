import { Stack } from '@mantine/core'
import { PortableText } from 'next-sanity'

import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { resolveArtistUrl } from '~/lib/sanity/sanity.links'
import { Blog as BlogType } from '~/schemas/models/blog'
import { MailingListContent } from '~/schemas/models/mailingList'
import { NavigationPages } from '~/utils/navigation'

import MinimalArtistCard from '../ArtistCard/MinimalArtistCard'
import MailingList from '../MailingList/MailingList'
import { PortableTextComponents } from '../PortableTextComponents/PortableTextComponents'
import Blog from './Blog'

interface IBlogPage {
  blog: BlogType
  mailingListContent?: MailingListContent
}

const BlogPage = ({ blog, mailingListContent }: IBlogPage) => {
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
        {blog.content && (
          <PortableText
            value={blog.content}
            components={PortableTextComponents}
          />
        )}
      </Blog.Content>

      <Blog.ShareButton title={blog.title} mb="lg" p={0} />
      <MinimalArtistCard
        artist={blog.artist}
        showPortfolioLink
        mb={{ base: 50, sm: 75, md: 100 }}
      />
      {mailingListContent && <MailingList content={mailingListContent} />}
    </Blog>
  )
}

export default BlogPage
