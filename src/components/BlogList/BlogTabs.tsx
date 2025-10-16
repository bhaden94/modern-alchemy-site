'use client'

import { LoadingOverlay, Tabs } from '@mantine/core'
import { useEffect, useState } from 'react'

import { useErrorDialog } from '~/hooks/useErrorDialog'
import { useSuccessDialog } from '~/hooks/useSuccessDialog'
import { getAllBlogsByArtist } from '~/lib/sanity/queries/sanity.blogsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { Blog } from '~/schemas/models/blog'

import AdminBlogList from './AdminBlogList'
import classes from './BlogTabs.module.css'

interface IBlogTabs {
  artistId: string
}

const BlogTabs = ({ artistId }: IBlogTabs) => {
  const { openErrorDialog } = useErrorDialog()
  const { openSuccessDialog } = useSuccessDialog()
  const [deletingId, setDeletingId] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)

  const [blogPosts, setBlogPosts] = useState<Blog[]>([])

  const draftBlogs = blogPosts.filter((blog) => blog.state === 'draft')
  const publishedBlogs = blogPosts.filter((blog) => blog.state === 'published')

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      try {
        const client = getClient()
        const blogs = await getAllBlogsByArtist(client, artistId)
        setBlogPosts(blogs || [])
      } catch (error) {
        openErrorDialog('Failed to fetch blogs. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
        setBlogPosts(blogPosts.filter((blog) => blog._id !== id))
      }
    } catch (error) {
      openErrorDialog(
        'Failed to delete blog. If this continues to happen, please contact the developer.',
      )
    } finally {
      setDeletingId(undefined)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={loading} />
      <Tabs defaultValue="drafts" classNames={classes}>
        <Tabs.List justify="center" mb="lg">
          <Tabs.Tab value="drafts">Drafts</Tabs.Tab>
          <Tabs.Tab value="published">Published</Tabs.Tab>
          <Tabs.Tab value="all">All Articles</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="drafts">
          <AdminBlogList
            blogs={draftBlogs}
            handleBlogDelete={handleBlogDelete}
            deletingId={deletingId}
          />
        </Tabs.Panel>
        <Tabs.Panel value="published">
          <AdminBlogList
            blogs={publishedBlogs}
            handleBlogDelete={handleBlogDelete}
            deletingId={deletingId}
          />
        </Tabs.Panel>
        <Tabs.Panel value="all">
          <AdminBlogList
            blogs={blogPosts}
            handleBlogDelete={handleBlogDelete}
            deletingId={deletingId}
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export default BlogTabs
