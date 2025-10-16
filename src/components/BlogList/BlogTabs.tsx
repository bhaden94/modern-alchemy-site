'use client'

import { Tabs } from '@mantine/core'

import { Blog } from '~/schemas/models/blog'

import { AdminBlogList } from './BlogList'
import classes from './BlogTabs.module.css'

interface IBlogTabs {
  blogs: Blog[]
}

const BlogTabs = ({ blogs }: IBlogTabs) => {
  return (
    <Tabs defaultValue="drafts" classNames={classes}>
      <Tabs.List justify="center" mb="lg">
        <Tabs.Tab value="drafts">Drafts</Tabs.Tab>
        <Tabs.Tab value="published">Published</Tabs.Tab>
        <Tabs.Tab value="all">All Blogs</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="drafts">
        <AdminBlogList blogs={blogs.filter((blog) => blog.state === 'draft')} />
      </Tabs.Panel>
      <Tabs.Panel value="published">
        <AdminBlogList
          blogs={blogs.filter((blog) => blog.state === 'published')}
        />
      </Tabs.Panel>
      <Tabs.Panel value="all">
        <AdminBlogList blogs={blogs} />
      </Tabs.Panel>
    </Tabs>
  )
}

export default BlogTabs
