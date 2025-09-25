'use client'

import { Container, LoadingOverlay, Stack } from '@mantine/core'
import imageCompression from 'browser-image-compression'
import { useRef, useState } from 'react'

import AdminTextEditor from '~/components/AdminControls/AdminTextEditor/AdminTextEditor'
import BlogPage from '~/components/Blog/BlogPage'
import PageContainer from '~/components/PageContainer'
import { useErrorDialog } from '~/hooks/useErrorDialog'
import { BlockContent } from '~/schemas/models/blockContent'
import { Blog } from '~/schemas/models/blog'
import uploadImagesToSanity, {
  ImageReference,
} from '~/utils/images/uploadImagesToSanity'

import AdminBlogEditorActionBar from './AdminBlogEditorActionBar/AdminBlogEditorActionBar'
import AdminBlogTitleEditor from './AdminBlogTitleEditor/AdminBlogTitleEditor'
import EditableCoverImage from './EditableCoverImage/EditableCoverImage'

interface AdminBlogEditorContentProps {
  documentId: string
  blog?: Blog
}

// Working cover image, title, and content editor for a blog post.
// TODO:
// - clean up any code smells

export default function AdminBlogEditor({
  documentId,
  blog,
}: AdminBlogEditorContentProps) {
  const { openErrorDialog } = useErrorDialog()

  const [savedBlog, setSavedBlog] = useState<Blog | undefined>(blog)

  const [title, setTitle] = useState<string | undefined>(blog?.title)
  const [content, setContent] = useState<BlockContent | undefined>(
    blog?.content,
  )
  const [coverImage, setCoverImage] = useState<
    ImageReference | { url: string; alt?: string } | undefined
  >(blog?.coverImage)
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null)
  const [pendingRemove, setPendingRemove] = useState<boolean>(false)
  const initialCoverImageRef = useRef<ImageReference | undefined>(
    blog?.coverImage,
  )
  const previewUrlRef = useRef<string | null>(null)

  const [showBlogPreview, setShowBlogPreview] = useState<boolean>(false)
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
        setSavedBlog(responseBody as Blog)

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

  const BlogPreview = () => {
    return savedBlog && <BlogPage blog={savedBlog} />
  }

  return (
    <>
      <AdminBlogEditorActionBar
        saveAll={saveAll}
        togglePreview={() => setShowBlogPreview(!showBlogPreview)}
        isSaving={isSaving}
        isPreview={showBlogPreview}
      />
      {showBlogPreview ? (
        <BlogPreview />
      ) : (
        <>
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
                  initialValue={blog?.content}
                  fieldName="content"
                  documentId={documentId}
                  hideActions
                  setContentCallback={setContent}
                />
              </Container>
            </Stack>
          </PageContainer>
        </>
      )}
    </>
  )
}
