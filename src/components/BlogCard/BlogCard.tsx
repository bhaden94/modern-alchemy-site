'use client'

import { Box, Group, Image, Overlay, Stack, Title } from '@mantine/core'
import { useRouter } from 'next/navigation'

import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { Blog } from '~/schemas/models/blog'

import styles from './BlogCard.module.css'

interface IBlogCard {
  blog: Blog
  blogLink?: string
  children?: React.ReactNode
}

const BlogCard = ({ blog, blogLink, children }: IBlogCard) => {
  const imageUrl = getImageFromRef(blog.coverImage)?.url || '/article.svg'
  const router = useRouter()

  const onBlogClick = () => {
    blogLink && router.push(blogLink)
  }

  return (
    <Box className={styles.blogCard} onClick={onBlogClick}>
      {/* TODO: placeholder on image like the rest of the site */}
      <Image
        src={imageUrl}
        alt={blog.title || 'Blog post'}
        className={styles.image}
      />

      <Overlay
        color="#000"
        backgroundOpacity={0.35}
        className={styles.overlay}
      />

      {/* Content overlay */}
      <Box className={styles.contentOverlay}>
        <Box />

        <Stack gap="md">
          <Title order={3} size="h4" className={styles.title}>
            {blog.title || 'Untitled'}
          </Title>

          <Group>{children}</Group>
        </Stack>
      </Box>
    </Box>
  )
}

export default BlogCard
