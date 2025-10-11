import z from 'zod'

import { ACCEPTED_IMAGE_TYPES, MAX_FILES_SIZE } from './FormConstants'

// Image validation function similar to booking forms
const validateCoverImage = (
  file: File | undefined,
  ctx: z.RefinementCtx,
): boolean => {
  if (!file) {
    // Cover image is optional for blogs
    return true
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'File must be a valid image type (JPEG, PNG, WebP).',
    })
    return false
  }

  if (file.size > MAX_FILES_SIZE) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Image size exceeds the limit.',
    })
    return false
  }

  return true
}

// Cover image refinement
const coverImageRefinement = (
  file: File | undefined,
  ctx: z.RefinementCtx,
): boolean => {
  return validateCoverImage(file, ctx)
}

export const blogEditorSchema = z.object({
  title: z.string().optional(),
  content: z.any().optional(), // BlockContent is complex, using any for flexibility
  // Now we can properly validate the cover image as a File
  coverImage: z.custom<File>().optional().superRefine(coverImageRefinement),
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
