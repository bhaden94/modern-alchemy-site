import { ComboboxItem } from '@mantine/core'
import z from 'zod'

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
)

export const MAX_FILES = 5
export const MAX_FILE_SIZE = 10485760 // 10MB
export const ACCEPTED_IMAGE_TYPES = [
  'image/png',
  'image/gif',
  'image/jpeg',
  'image/svg+xml',
  'image/webp',
  'image/avif',
]

export const styleOptions: ComboboxItem[] = [
  {
    value: 'color',
    label: 'Color',
  },
  {
    value: 'black_and_grey',
    label: 'Black and Grey',
  },
]

export const priorTattooOptions: ComboboxItem[] = [
  {
    value: 'new_tattoo',
    label: 'Yes - I want a new tattoo',
  },
  {
    value: 'ongoing_project',
    label: 'Yes - this is an ongoing project',
  },
  {
    value: 'no',
    label: 'No',
  },
]

export const preferredDayOptions: ComboboxItem[] = [
  {
    value: 'monday',
    label: 'Monday',
  },
  {
    value: 'tuesday',
    label: 'Tuesday',
  },
  {
    value: 'wednesday',
    label: 'Wednesday',
  },
  {
    value: 'thursday',
    label: 'Thursday',
  },
  {
    value: 'friday',
    label: 'Friday',
  },
]

export const bookingSchema = z.object({
  name: z.string(),
  phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number'),
  email: z.string().email({ message: 'Invalid email address' }),
  characters: z.string(),
  description: z.string(),
  location: z.string(),
  style: z.string(),
  priorTattoo: z.string(),
  preferredDay: z.string(),
  showcaseImages: z.custom<File[]>().superRefine((files, ctx) => {
    if (files.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'File must be provided',
      })
      return false
    }

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
          message: 'File must be a valid image type',
        })
        return false
      }
    }

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Each file must be less than 10MB',
        })
        return false
      }
    }

    return true
  }),
})

// extracting the type
export type TBookingSchema = z.infer<typeof bookingSchema>
