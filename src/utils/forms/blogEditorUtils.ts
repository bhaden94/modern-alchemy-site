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

const validateImageFiles = (files: File[], ctx: z.RefinementCtx): boolean => {
  if (files.length > MAX_FILES) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A maximum of 5 images can be uploaded',
    })
    return false
  }

  for (let i = 0; i < files.length; i++) {
    if (!ACCEPTED_IMAGE_TYPES.includes(files[i].type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `File must be a valid image type.`,
      })
      return false
    }
  }

  let filesSize = 0
  files.forEach((file) => (filesSize += file.size))
  if (filesSize > MAX_FILES_SIZE) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Total image size exceeds limit.',
    })
    return false
  }

  return true
}

// Custom checks for required images in booking form
const imagesRefinement = (files: File[], ctx: z.RefinementCtx): boolean => {
  if (!files || files.length < MIN_FILES) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `At least ${MIN_FILES} image(s) must be provided.`,
    })
    return false
  }

  return validateImageFiles(files, ctx)
}
