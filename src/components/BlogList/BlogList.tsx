'use client'

import { Box, Button } from '@mantine/core'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import Link from 'next/link'
import { useState } from 'react'

import { useErrorDialog } from '~/hooks/useErrorDialog'
import { useSuccessDialog } from '~/hooks/useSuccessDialog'
import { Blog } from '~/schemas/models/blog'
import { NavigationPages } from '~/utils/navigation'

import BlogCard from '../BlogCard/BlogCard'
import DeleteWithConfirmation from '../DeleteWithConfirmation/DeleteWithConfirmation'
import classes from './BlogList.module.css'

interface IBlogList {
  blogs: Blog[]
}

export const AdminBlogList = ({ blogs }: IBlogList) => {
  const { openErrorDialog } = useErrorDialog()
  const { openSuccessDialog } = useSuccessDialog()
  const [blogsList, setBlogsList] = useState(blogs)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleBlogDelete = async (id: string) => {
    setDeletingId(id)

    try {
      const response = await fetch('/api/sanity/blog', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId: id }),
      })

      if (response.ok) {
        openSuccessDialog('Successfully deleted blog post.')
        setBlogsList(blogsList.filter((blog) => blog._id !== id))
      }
    } catch (error) {
      openErrorDialog(
        'Failed to delete blog. If this continues to happen, please contact the developer.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Box className={classes.container}>
      {blogsList.map((blog) => (
        <div key={blog._id} className={classes.blog}>
          <BlogCard blog={blog}>
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
              isDeleting={
                deletingId?.toLocaleLowerCase() === blog._id.toLocaleLowerCase()
              }
              onDeleteConfirmed={() => handleBlogDelete(blog._id)}
              deleteButtonText="Delete"
              confirmationMessage={`Are you sure you want to delete blog post with title "${blog.title}"? The operation cannot be undone.`}
              buttonProps={{ leftSection: <IconTrash /> }}
            />
          </BlogCard>
        </div>
      ))}
    </Box>
  )
}

export const BlogList = ({ blogs }: IBlogList) => {
  return (
    <Box className={classes.container}>
      {blogs.map((blog) => (
        <div key={blog._id} className={classes.blog}>
          {/* TODO: artist name and published at date */}
          <BlogCard
            blog={blog}
            blogLink={`${NavigationPages.Blog}/${blog.slug?.current}`}
          ></BlogCard>
        </div>
      ))}
    </Box>
  )
}
