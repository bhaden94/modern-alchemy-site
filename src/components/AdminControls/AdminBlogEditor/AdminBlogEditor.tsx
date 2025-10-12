'use client'

import { Container, LoadingOverlay, Stack } from '@mantine/core'
import imageCompression from 'browser-image-compression'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useState } from 'react'

import BlogPage from '~/components/Blog/BlogPage'
import PageContainer from '~/components/PageContainer'
import { useErrorDialog } from '~/hooks/useErrorDialog'
import { useSuccessDialog } from '~/hooks/useSuccessDialog'
import {
  deleteImagesFromSanity,
  ImageReference,
  uploadImagesToSanity,
} from '~/lib/sanity/sanity.image'
import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { Blog } from '~/schemas/models/blog'
import {
  BlogEditorFormProvider,
  useBlogEditorForm,
} from '~/utils/forms/blogEditorFormContext'
import {
  BlogEditorField,
  blogEditorSchema,
  getFormAction,
  setPublishFields,
  setUnPublishFields,
  TBlogEditorSchema,
} from '~/utils/forms/blogEditorUtils'

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
      // Don't set coverImage in initial values - it will be handled separately
      coverImage: undefined,
    },
    validate: zodResolver(blogEditorSchema),
  })

  const [savedBlog, setSavedBlog] = useState<Blog | undefined>(blog)
  const [showBlogPreview, setShowBlogPreview] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Keep track of server image and if it's marked for removal
  const [serverCoverImage, setServerCoverImage] = useState<
    ImageReference | null | undefined
  >(blog?.coverImage)
  const [serverImageMarkedForRemoval, setServerImageMarkedForRemoval] =
    useState<boolean>(false)

  const handleFormSubmit = async (
    formValues: TBlogEditorSchema,
    event?: React.FormEvent<HTMLFormElement>,
  ) => {
    setIsSubmitting(true)
    const action = getFormAction(event)

    try {
      let coverUpdate: ImageReference | null = serverCoverImage ?? null

      // Handle cover image upload if a new file was selected
      if (formValues.coverImage) {
        const imageReferences = await uploadImagesToSanity(
          [formValues.coverImage],
          {
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
          },
        )

        if (
          imageReferences === 'GeneralError' ||
          imageReferences === 'SizeLimitError'
        ) {
          return
        }

        if (imageReferences && imageReferences.length > 0) {
          coverUpdate = imageReferences[0]
        }
      }

      // Handle server image removal
      // null will unset the field in our API route
      if (serverImageMarkedForRemoval) {
        coverUpdate = null
      }

      // Prepare the update payload
      const updates: Partial<Blog> = {
        title: formValues.title,
        content: formValues.content,
        coverImage: coverUpdate,
      }

      if (action === 'publish') {
        if (!updates.title || !updates.content) {
          openErrorDialog('Title and content are required to publish.')
          setIsSubmitting(false)
          return
        }

        setPublishFields(updates, formValues.title, savedBlog?.slug?.current)
      }

      if (action === 'unpublish') {
        setUnPublishFields(updates)
      }

      const res = await fetch('/api/sanity/blog', {
        method: 'PATCH',
        body: JSON.stringify({
          documentId,
          updates,
        }),
      })

      if (!res.ok) {
        openErrorDialog(await res.text())
        return
      }

      const responseBody: Partial<Blog & { imageKeyToDelete?: string }> =
        await res.json()

      // Update server image reference and reset removal flag
      setServerCoverImage(responseBody.coverImage)
      setServerImageMarkedForRemoval(false)

      // Reset form with new values
      form.setValues({
        title: responseBody.title,
        content: responseBody.content,
        coverImage: undefined, // Always reset to undefined after save
      })
      form.resetDirty()
      setSavedBlog(responseBody as Blog)

      openSuccessDialog('Blog updated.')

      // Clean up old image if needed
      if (responseBody.imageKeyToDelete) {
        deleteImagesFromSanity([responseBody.imageKeyToDelete]).catch(() => {
          // swallow errors; deletion is best-effort
        })
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
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      })
    } catch (error) {
      openErrorDialog('There was an issue preparing the cover image.')
      return
    }

    const fileToUse = compressedFile || file

    // Set the file in the form and clear any server image removal flag
    form.setFieldValue(BlogEditorField.CoverImage.id, fileToUse)
    setServerImageMarkedForRemoval(false)
  }

  const handleImageRemove = async () => {
    // Clear the form field
    form.setFieldValue(BlogEditorField.CoverImage.id, undefined)

    // If there's a server image, mark it for removal
    if (serverCoverImage && !serverImageMarkedForRemoval) {
      setServerImageMarkedForRemoval(true)
    }
  }

  // Get the current image to display (either from server or form)
  const getCurrentImage = () => {
    const formFile = form.getValues().coverImage
    if (formFile) {
      // Show preview of selected file
      return {
        url: URL.createObjectURL(formFile),
        alt: formFile.name,
      }
    }
    // Show server image if no file selected and server image not marked for removal
    if (serverCoverImage && !serverImageMarkedForRemoval) {
      const serverImage = getImageFromRef(serverCoverImage)
      if (serverImage) {
        return {
          url: serverImage.url,
          alt: serverImage.altText || '',
        }
      }
    }

    return undefined
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
                onRemove={handleImageRemove}
                disabled={isSubmitting}
                currentImage={getCurrentImage()}
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
