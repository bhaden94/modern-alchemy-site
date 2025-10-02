'use client'

import { Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import { useErrorDialog } from '~/hooks/useErrorDialog'
import { Blog } from '~/schemas/models/blog'
import { NavigationPages } from '~/utils/navigation'

interface ICreateBlogButton {
  artistId: string
}

const CreateBlogButton: React.FC<ICreateBlogButton> = ({ artistId }) => {
  const { openErrorDialog } = useErrorDialog()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleCreateBlog = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/sanity/blog', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artistId }),
      })

      if (response.status === 201) {
        const newBlog: Blog = await response.json()
        setIsSubmitting(false)
        router.push(
          `${NavigationPages.EmployeePortal}/${artistId}/${NavigationPages.Blog}/${newBlog._id}`,
        )
      }
    } catch (error) {
      openErrorDialog(`Failed to create blog.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      onClick={handleCreateBlog}
      leftSection={<IconPlus />}
      loading={isSubmitting}
    >
      Create Article
    </Button>
  )
}

export default CreateBlogButton
