import { Box } from '@mantine/core'

import { Blog } from '~/schemas/models/blog'

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
          <BlogCard blog={blog} />
        </div>
      ))}
    </Box>
  )
}

export default BlogList
