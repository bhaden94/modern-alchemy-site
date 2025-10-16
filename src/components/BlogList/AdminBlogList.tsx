import { Box, Button, Group } from '@mantine/core'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import Link from 'next/link'

import { Blog } from '~/schemas/models/blog'
import { NavigationPages } from '~/utils/navigation'

import BlogCard from '../BlogCard/BlogCard'
import DeleteWithConfirmation from '../DeleteWithConfirmation/DeleteWithConfirmation'
import classes from './BlogList.module.css'

interface IAdminBlogList {
  blogs: Blog[]
  handleBlogDelete: (id: string) => void
  deletingId?: string
}

const AdminBlogList = ({
  blogs,
  handleBlogDelete,
  deletingId,
}: IAdminBlogList) => {
  return (
    <Box className={classes.container}>
      {blogs.map((blog) => (
        <div key={blog._id} className={classes.blog}>
          <BlogCard blog={blog}>
            <Group>
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
                  deletingId?.toLocaleLowerCase() ===
                  blog._id.toLocaleLowerCase()
                }
                onDeleteConfirmed={() => handleBlogDelete(blog._id)}
                deleteButtonText="Delete"
                confirmationMessage={`Are you sure you want to delete blog post with title "${blog.title}"? The operation cannot be undone.`}
                buttonProps={{ leftSection: <IconTrash /> }}
              />
            </Group>
          </BlogCard>
        </div>
      ))}
    </Box>
  )
}

export default AdminBlogList
