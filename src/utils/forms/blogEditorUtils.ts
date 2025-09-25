import z from 'zod'

import { BlockContent } from '~/schemas/models/blockContent'
import { ImageReference } from '~/utils/images/uploadImagesToSanity'

export const blogEditorSchema = z.object({
  title: z.string().optional(),
  content: z.any().optional(), // BlockContent is complex, using any for flexibility
  coverImage: z.any().optional(), // ImageReference | preview object
})

// extracting the type
export type TBlogEditorSchema = z.infer<typeof blogEditorSchema>

export const BlogEditorField = {
  Title: {
    id: 'title' as keyof TBlogEditorSchema,
    label: 'Title',
    placeholder: 'Enter blog title...',
  },
  Content: {
    id: 'content' as keyof TBlogEditorSchema,
    label: 'Content',
    placeholder: 'Write your blog content...',
  },
  CoverImage: {
    id: 'coverImage' as keyof TBlogEditorSchema,
    label: 'Cover Image',
    placeholder: 'Upload a cover image',
  },
} as const

export const getBlogEditorInitialValues = (blog?: {
  title?: string
  content?: BlockContent
  coverImage?: ImageReference
}): TBlogEditorSchema => ({
  title: blog?.title || undefined,
  content: blog?.content || undefined,
  coverImage: blog?.coverImage || undefined,
})
