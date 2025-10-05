import z from 'zod'

export const blogEditorSchema = z.object({
  title: z.string().optional(),
  content: z.any().optional(), // BlockContent is complex, using any for flexibility
  // TODO: can we use image refinement here like in our bookings forms?
  // - It would require adjusting the blog editor quite a bit possibly
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
