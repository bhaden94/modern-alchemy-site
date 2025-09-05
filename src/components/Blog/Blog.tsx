import React from 'react'
import PageContainer from '~/components/PageContainer'
import { Container } from '@mantine/core'
import CoverImage from '~/components/Blog/CoverImage/CoverImage'
import { BlogHeader, IBlogHeader } from '~/components/Blog/BlogHeader/BlogHeader'

export interface IBlogRoot {
  children: React.ReactNode
  className?: string
  coverImage?: { url?: string | null; alt?: string }
}

const BlogRoot: React.FC<IBlogRoot> = ({ children, className, coverImage }) => {
  return (
    <>
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
    </>
  )
}

interface BlogComposition extends React.FC<IBlogRoot> {
  Header: React.FC<IBlogHeader>
}

export const Blog = BlogRoot as BlogComposition
Blog.Header = BlogHeader

export default Blog
