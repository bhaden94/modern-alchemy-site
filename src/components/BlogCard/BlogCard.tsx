'use client'

import { Box, Stack, Title } from '@mantine/core'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { Blog } from '~/schemas/models/blog'
import { generateNextImagePlaceholder } from '~/utils'

import styles from './BlogCard.module.css'

interface IBlogCard {
  blog: Blog
  blogLink?: string
  children?: React.ReactNode
}

const BlogCard = ({ blog, blogLink, children }: IBlogCard) => {
  const imageData = getImageFromRef(blog.coverImage)
  // Get image dimensions for aspect ratio, fallback to common blog aspect ratio
  const imageWidth = imageData?.metadata?.dimensions?.width || 1
  const imageHeight = imageData?.metadata?.dimensions?.height || 1
  const aspectRatio = imageWidth / imageHeight

  const imageUrl = imageData?.url || '/article.svg'
  const router = useRouter()

  const onBlogClick = () => {
    blogLink && router.push(blogLink)
  }

  return (
    <Box
      className={styles.blogCard}
      style={{ aspectRatio: aspectRatio }}
      onClick={onBlogClick}
    >
      <Image
        src={imageUrl}
        alt={blog.title || 'Blog post'}
        fill
        sizes="100%"
        className={styles.image}
        placeholder={
          imageData
            ? generateNextImagePlaceholder(imageWidth, imageHeight)
            : undefined
        }
      />

      <Box className={styles.contentOverlay}>
        <Box />

        <Stack gap="sm" p="md">
          <Title order={2} size="h4" className={styles.title}>
            {blog.title || 'Untitled'}
          </Title>

          {children}
        </Stack>
      </Box>
    </Box>
  )
}

export default BlogCard
