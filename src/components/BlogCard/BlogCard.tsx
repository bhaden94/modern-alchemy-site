'use client'

import { Box, Button, Group, Image, Overlay, Stack, Title } from '@mantine/core'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import Link from 'next/link'

import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { Blog } from '~/schemas/models/blog'
import { NavigationPages } from '~/utils/navigation'

import DeleteWithConfirmation from '../DeleteWithConfirmation/DeleteWithConfirmation'
import styles from './BlogCard.module.css'

interface IBlogCard {
  blog: Blog
}

const BlogCard = ({ blog }: IBlogCard) => {
  const imageUrl = getImageFromRef(blog.coverImage)?.url || '/article.svg'

  return (
    <Box className={styles.blogCard}>
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

          <Group>
            {/* TODO: Everything under here should be passed by a parent and not controlled direction in the card component */}
            {/* In admin page, it is edit/delete button. In normal page it is the artist/date published information */}
            <Button
              leftSection={<IconPencil />}
              size="sm"
              component={Link}
              href={`${NavigationPages.EmployeePortal}/${blog.artist._id}/${NavigationPages.Blog}/${blog._id}`}
              target="_blank"
              prefetch={false}
            >
              Edit
            </Button>
            <DeleteWithConfirmation
              isDeleting={false}
              disabled={false}
              onDeleteConfirmed={() => console.log('confirm delete')}
              deleteButtonText="Delete"
              confirmationMessage="Are you sure you want to delete this blog post? The operation cannot be undone."
              buttonProps={{ leftSection: <IconTrash /> }}
            />
          </Group>
        </Stack>
      </Box>
    </Box>
  )
}

export default BlogCard
