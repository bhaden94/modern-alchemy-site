'use client'

import { Box, Stack, Text } from '@mantine/core'

import { Blog } from '~/schemas/models/blog'
import { formatDate } from '~/utils'
import { NavigationPages } from '~/utils/navigation'

import BlogCard from '../BlogCard/BlogCard'
import classes from './BlogList.module.css'

interface IBlogList {
  blogs: Blog[]
}

const BlogList = ({ blogs }: IBlogList) => {
  return (
    <Box className={classes.container}>
      {blogs.map((blog) => (
        <div key={blog._id} className={classes.blog}>
          <BlogCard
            blog={blog}
            blogLink={`${NavigationPages.Blog}/${blog.slug?.current}`}
          >
            <Stack gap={0}>
              <Text c="dimmed">{blog.artist.name}</Text>
              <Text c="dimmed">
                {blog.publishedAt && formatDate(blog.publishedAt, false)}
              </Text>
            </Stack>
          </BlogCard>
        </div>
      ))}
    </Box>
  )
}

export default BlogList
