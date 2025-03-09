import z from 'zod'

export const announcementSchema = z
  .object({
    title: z.string().optional(),
    enabled: z.boolean(),
  })
  .refine(
    // if banner enabled, then title must be present
    ({ title, enabled }) => {
      if (enabled) {
        return title && title.length > 0
      }

      return true
    },
    () => ({
      message:
        'If the announcement banner is enabled, then there must be banner text.',
      path: ['title'],
    }),
  )

// extracting the type
export type TAnnouncementSchema = z.infer<typeof announcementSchema>

export const AnnouncementField = {
  Title: {
    id: 'title',
    label: 'Banner text',
  },
  Enabled: {
    id: 'enabled',
    label: 'Show announcement banner',
  },
} as const
