'use client'

import { Container, LoadingOverlay, Stack } from '@mantine/core'
import { useState } from 'react'

import AdminTextEditor from '~/components/AdminControls/AdminTextEditor/AdminTextEditor'
import CoverImage from '~/components/Blog/CoverImage/CoverImage'
import PageContainer from '~/components/PageContainer'
import { useErrorDialog } from '~/hooks/useErrorDialog'
import { BlockContent } from '~/schemas/models/blockContent'

import AdminBlogEditorActionBar from './AdminBlogEditorActionBar'
import AdminBlogTitleEditor from './AdminBlogTitleEditor'

interface AdminBlogEditorContentProps {
  documentId: string
  initialTitle?: string
  initialContent?: BlockContent
  initialCoverImage?: { url?: string | null; alt?: string }
}

export default function AdminBlogEditorContent({
  documentId,
  initialTitle,
  initialContent,
  initialCoverImage,
}: AdminBlogEditorContentProps) {
  const { openErrorDialog } = useErrorDialog()
  const [title, setTitle] = useState<string>(initialTitle ?? '')
  const [content, setContent] = useState<BlockContent | undefined>(
    initialContent,
  )
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const onTitleChange = (value: string) => {
    setTitle(value)
  }

  const saveAll = async () => {
    setIsSaving(true)

    try {
      const res = await fetch('/api/sanity/blog', {
        method: 'PATCH',
        body: JSON.stringify({
          documentId,
          updates: {
            title,
            content,
          },
        }),
      })

      if (!res.ok) {
        openErrorDialog('There was an issue saving changes to the blog.')
      }
    } catch (err) {
      openErrorDialog('There was an issue saving changes to the blog.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <AdminBlogEditorActionBar saveAll={saveAll} isSaving={isSaving} />
      {initialCoverImage?.url && (
        <CoverImage
          image={{
            url: initialCoverImage.url,
            alt: initialCoverImage.alt || 'Blog cover image',
          }}
          overlayZIndex={100}
        />
      )}
      <PageContainer>
        <Stack>
          <Container pos="relative" size="xs" px={0}>
            <LoadingOverlay visible={isSaving} zIndex={150} />
            <AdminBlogTitleEditor title={title} onChange={onTitleChange} />
            <AdminTextEditor
              initialValue={initialContent}
              fieldName="content"
              documentId={documentId}
              hideActions
              setContentCallback={setContent}
            />
          </Container>
        </Stack>
      </PageContainer>
    </>
  )
}
