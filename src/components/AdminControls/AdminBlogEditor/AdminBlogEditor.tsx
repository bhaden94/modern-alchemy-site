'use client'

import { Container, LoadingOverlay, Stack } from '@mantine/core'
import imageCompression from 'browser-image-compression'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useRef, useState } from 'react'

import BlogPage from '~/components/Blog/BlogPage'
import PageContainer from '~/components/PageContainer'
import { useErrorDialog } from '~/hooks/useErrorDialog'
import { useSuccessDialog } from '~/hooks/useSuccessDialog'
import { Blog } from '~/schemas/models/blog'
import { slugify } from '~/utils'
import {
  BlogEditorFormProvider,
  useBlogEditorForm,
} from '~/utils/forms/blogEditorFormContext'
import {
  BlogEditorField,
  blogEditorSchema,
  TBlogEditorSchema,
} from '~/utils/forms/blogEditorUtils'
import uploadImagesToSanity, {
  ImageReference,
} from '~/utils/images/uploadImagesToSanity'

import AdminBlogEditorActionBar from './AdminBlogEditorActionBar/AdminBlogEditorActionBar'
import AdminBlogInformationBar from './AdminBlogInformationBar/AdminBlogInformationBar'
import AdminBlogTitleEditor from './AdminBlogTitleEditor/AdminBlogTitleEditor'
import BlogEditorTextEditor from './BlogEditorTextEditor/BlogEditorTextEditor'
import EditableCoverImage from './EditableCoverImage/EditableCoverImage'

interface AdminBlogEditorContentProps {
  documentId: string
  blog?: Blog
}

export default function AdminBlogEditor({
  documentId,
  blog,
}: AdminBlogEditorContentProps) {
  const { openSuccessDialog } = useSuccessDialog()
  const { openErrorDialog } = useErrorDialog()

  // Mantine form for managing form state
  const formId = 'blog-editor-form'
  const form = useBlogEditorForm({
    mode: 'uncontrolled',
    initialValues: {
      title: blog?.title,
      content: blog?.content,
      coverImage: blog?.coverImage,
    },
    validate: zodResolver(blogEditorSchema),
  })

  // UI and image handling states
  const [savedBlog, setSavedBlog] = useState<Blog | undefined>(blog)
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null)
  const [pendingRemove, setPendingRemove] = useState<boolean>(false)
  const [showBlogPreview, setShowBlogPreview] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Refs for image handling
  const initialCoverImageRef = useRef<ImageReference | undefined | null>(
    blog?.coverImage,
  )
  const previewUrlRef = useRef<string | null>(null)

  const handleFormSubmit = async (
    formValues: TBlogEditorSchema,
    event?: React.FormEvent<HTMLFormElement>,
  ) => {
    setIsSubmitting(true)

    // Get the submitter to determine which button was clicked
    const submitter = (event?.nativeEvent as SubmitEvent)
      ?.submitter as HTMLButtonElement
    const action = submitter?.value || 'save' // default to save

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
            setIsSubmitting(false)
          },
          error: () => {
            openErrorDialog('There was a problem uploading the cover image.')
            setIsSubmitting(false)
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

      // Prepare the update payload
      const updates: Partial<Blog> = {
        title: formValues.title,
        content: formValues.content,
        coverImage: coverUpdate,
      }

      // If publishing, ensure required fields and set state
      if (action === 'publish') {
        if (!updates.title || !updates.content) {
          openErrorDialog('Title and content are required to publish.')
          setIsSubmitting(false)
          return
        }
        updates.state = 'published'
        updates.publishedAt = new Date().toISOString()
        // If there is already a slug, then don't override
        // Otherwise, set a new slug based on the title
        updates.slug = {
          _type: 'slug',
          current: savedBlog?.slug?.current ?? slugify(formValues.title),
        }
      }

      if (action === 'unpublish') {
        updates.state = 'draft'
        updates.publishedAt = null
      }

      const res = await fetch('/api/sanity/blog', {
        method: 'PATCH',
        body: JSON.stringify({
          documentId,
          updates,
        }),
      })

      if (res.ok) {
        const responseBody: Partial<Blog & { imageKeyToDelete?: string }> =
          await res.json()

        setPendingCoverFile(null)
        setPendingRemove(false)
        // Update the initial server-backed reference so future saves will send the correct value
        initialCoverImageRef.current = responseBody.coverImage

        // Update form values with server response
        form.setValues({
          title: responseBody.title,
          content: responseBody.content,
          coverImage: responseBody.coverImage,
        })
        form.resetDirty()
        setSavedBlog(responseBody as Blog)

        openSuccessDialog('Blog updated.')

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
      } else {
        openErrorDialog(await res.text())
      }
    } catch (err) {
      openErrorDialog(
        `There was an issue ${action === 'publish' ? 'publishing' : 'saving'} changes to the blog.`,
      )
    } finally {
      setIsSubmitting(false)
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
    form.setFieldValue(BlogEditorField.CoverImage.id, {
      url: objectUrl,
      alt: fileToUse.name,
    })
  }

  const handleImageRemove = async () => {
    // mark for removal; actual deletion will occur when saving
    setPendingCoverFile(null)
    setPendingRemove(true)
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    form.setFieldValue(BlogEditorField.CoverImage.id, undefined)
  }

  const BlogPreview = () => {
    return savedBlog && <BlogPage blog={savedBlog} />
  }

  return (
    <BlogEditorFormProvider form={form}>
      <form id={formId} onSubmit={form.onSubmit(handleFormSubmit)}>
        <AdminBlogEditorActionBar
          togglePreview={() => setShowBlogPreview(!showBlogPreview)}
          isSubmitting={isSubmitting}
          isPreview={showBlogPreview}
          isPublished={savedBlog?.state === 'published'}
          formId={formId}
        />
        <AdminBlogInformationBar
          updatedAt={savedBlog?.updatedAt}
          publishedAt={savedBlog?.publishedAt}
        />
        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={isSubmitting} />
          {showBlogPreview ? (
            <BlogPreview />
          ) : (
            <>
              <EditableCoverImage
                onReplace={handleImageReplace}
                onRemove={
                  form.getValues().coverImage ? handleImageRemove : undefined
                }
                disabled={isSubmitting}
              />
              <PageContainer>
                <Stack>
                  <Container size="xs" px={0}>
                    <AdminBlogTitleEditor />
                    <BlogEditorTextEditor
                      initialValue={blog?.content}
                      documentId={documentId}
                    />
                  </Container>
                </Stack>
              </PageContainer>
            </>
          )}
        </div>
      </form>
    </BlogEditorFormProvider>
  )
}
