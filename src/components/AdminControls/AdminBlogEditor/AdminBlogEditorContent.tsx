'use client'

import { Container, LoadingOverlay, Stack } from '@mantine/core'
import imageCompression from 'browser-image-compression'
import { useRef, useState } from 'react'

import AdminTextEditor from '~/components/AdminControls/AdminTextEditor/AdminTextEditor'
import PageContainer from '~/components/PageContainer'
import { useErrorDialog } from '~/hooks/useErrorDialog'
import { BlockContent } from '~/schemas/models/blockContent'
import { Blog } from '~/schemas/models/blog'
import uploadImagesToSanity, {
  ImageReference,
} from '~/utils/images/uploadImagesToSanity'

import AdminBlogEditorActionBar from './AdminBlogEditorActionBar'
import AdminBlogTitleEditor from './AdminBlogTitleEditor'
import EditableCoverImage from './EditableCoverImage/EditableCoverImage'

interface AdminBlogEditorContentProps {
  documentId: string
  initialTitle?: string
  initialContent?: BlockContent
  initialCoverImage?: ImageReference
}

// Working cover image, title, and content editor for a blog post.
// TODO:
// - move inline styles to css module
// - clean up any code smells

export default function AdminBlogEditorContent({
  documentId,
  initialTitle,
  initialContent,
  initialCoverImage,
}: AdminBlogEditorContentProps) {
  const { openErrorDialog } = useErrorDialog()
  const [title, setTitle] = useState<string | undefined>(initialTitle)
  const [content, setContent] = useState<BlockContent | undefined>(
    initialContent,
  )
  const [coverImage, setCoverImage] = useState<
    ImageReference | { url: string; alt?: string } | undefined
  >(initialCoverImage)
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null)
  const [pendingRemove, setPendingRemove] = useState<boolean>(false)
  const initialCoverImageRef = useRef<ImageReference | undefined>(
    initialCoverImage,
  )
  const previewUrlRef = useRef<string | null>(null)

  const [isSaving, setIsSaving] = useState<boolean>(false)

  const onTitleChange = (value: string) => {
    setTitle(value)
  }

  const saveAll = async () => {
    setIsSaving(true)

    try {
      // Always compute a concrete coverUpdate to send to the server.
      // We never send a client-only preview object URL.
      let coverUpdate: ImageReference | null =
        initialCoverImageRef.current ?? null

      if (pendingCoverFile) {
        const imageReferences = await uploadImagesToSanity([pendingCoverFile], {
          sizeLimit: () => {
            openErrorDialog(
              'Cover image exceeds size limit. Please compress or choose a smaller image.',
            )
            setIsSaving(false)
          },
          error: () => {
            openErrorDialog('There was a problem uploading the cover image.')
            setIsSaving(false)
          },
        })

        if (
          imageReferences === 'GeneralError' ||
          imageReferences === 'SizeLimitError'
        ) {
          // errors handled by callbacks above
          return
        }

        // Use the first uploaded image as the cover image reference
        if (imageReferences && imageReferences.length > 0) {
          coverUpdate = imageReferences[0]
        }
      }

      // If user explicitly removed the image, send null to indicate deletion.
      if (!pendingCoverFile && pendingRemove) {
        coverUpdate = null
      }

      const res = await fetch('/api/sanity/blog', {
        method: 'PATCH',
        body: JSON.stringify({
          documentId,
          updates: {
            title,
            content,
            coverImage: coverUpdate,
          },
        }),
      })

      if (res.ok) {
        const responseBody: Partial<Blog & { imageKeyToDelete?: string }> =
          await res.json()

        setPendingCoverFile(null)
        setPendingRemove(false)
        // Update the initial server-backed reference so future saves will send the correct value
        initialCoverImageRef.current = responseBody.coverImage
        setCoverImage(responseBody.coverImage)
        setContent(responseBody.content)
        setTitle(responseBody.title)

        if (responseBody.imageKeyToDelete) {
          // Delete image
          // Don't block on failed image deletion.
          fetch('/api/sanity/images', {
            method: 'DELETE',
            body: JSON.stringify({
              imageReferences: [responseBody.imageKeyToDelete],
            }),
          }).catch(() => {
            // swallow errors; deletion is best-effort and should not block the UI
          })
        }

        previewUrlRef.current && URL.revokeObjectURL(previewUrlRef.current)
        previewUrlRef.current = null
      }
    } catch (err) {
      openErrorDialog('There was an issue saving changes to the blog.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageReplace = async (files: File[]) => {
    if (!files || !files.length) return
    const file = files[0]

    let compressedFile: File | null = null
    try {
      compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1500,
        useWebWorker: true,
      })
    } catch (error) {
      openErrorDialog('There was an issue preparing the cover image.')
      return
    }

    const fileToUse = compressedFile || file
    setPendingCoverFile(fileToUse)
    setPendingRemove(false)

    // show immediate preview
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
    }
    const objectUrl = URL.createObjectURL(fileToUse)
    previewUrlRef.current = objectUrl
    setCoverImage({ url: objectUrl, alt: fileToUse.name })
  }

  const handleImageRemove = async () => {
    // mark for removal; actual deletion will occur when saving
    setPendingCoverFile(null)
    setPendingRemove(true)
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    setCoverImage(undefined)
  }

  return (
    <>
      <AdminBlogEditorActionBar saveAll={saveAll} isSaving={isSaving} />
      <EditableCoverImage
        imageRef={coverImage}
        onReplace={handleImageReplace}
        onRemove={coverImage ? handleImageRemove : undefined}
        disabled={isSaving}
      />
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
