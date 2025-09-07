import { Container } from '@mantine/core'
import React from 'react'

import {
  BlogPublishInfo,
  IBlogPublishInfo,
} from '~/components/Blog/BlogPublishInfo/BlogPublishInfo'
import CoverImage from '~/components/Blog/CoverImage/CoverImage'
import PageContainer from '~/components/PageContainer'

import BlogContent, { IBlogContent } from './BlogContent/BlogContent'
import BlogShareButton, {
  IBlogShareButton,
} from './BlogShareButton/BlogShareButton'
import BlogTitle, { IBlogTitle } from './BlogTitle/BlogTitle'

export interface IBlogRoot {
  children: React.ReactNode
  className?: string
  coverImage?: { url?: string | null; alt?: string }
}

const BlogRoot: React.FC<IBlogRoot> = ({ children, className, coverImage }) => {
  return (
    <article>
      {coverImage?.url && (
        <CoverImage
          image={{
            url: coverImage.url,
            alt: coverImage.alt || 'Blog cover image',
          }}
        />
      )}
      <PageContainer>
        <Container size="xs" px={0} className={className}>
          {children}
        </Container>
      </PageContainer>
    </article>
  )
}

interface BlogComposition extends React.FC<IBlogRoot> {
  Title: React.FC<IBlogTitle>
  PublishInfo: React.FC<IBlogPublishInfo>
  ShareButton: React.FC<IBlogShareButton>
  Content: React.FC<IBlogContent>
}

export const Blog = BlogRoot as BlogComposition
Blog.Title = BlogTitle
Blog.PublishInfo = BlogPublishInfo
Blog.ShareButton = BlogShareButton
Blog.Content = BlogContent

export default Blog
