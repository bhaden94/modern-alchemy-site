import { ComboboxItem } from '@mantine/core'
import z from 'zod'

const phoneRegex = new RegExp(
  /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
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

// export const priorTattooOptions: ComboboxItem[] = [
//   {
//     value: 'new_tattoo',
//     label: 'Yes - I want a new tattoo',
//   },
//   {
//     value: 'ongoing_project',
//     label: 'Yes - this is an ongoing project',
//   },
//   {
//     value: 'no',
//     label: 'No',
//   },
// ]

// export const preferredDayOptions: ComboboxItem[] = [
//   {
//     value: 'monday',
//     label: 'Monday',
//   },
//   {
//     value: 'tuesday',
//     label: 'Tuesday',
//   },
//   {
//     value: 'wednesday',
//     label: 'Wednesday',
//   },
//   {
//     value: 'thursday',
//     label: 'Thursday',
//   },
//   {
//     value: 'friday',
//     label: 'Friday',
//   },
// ]

const nameError = 'Please enter your full name'
const phoneNumberRegexError = 'Invalid phone number'
const phoneNumberError = 'Please enter your phone number'
const emailError = 'Invalid email address'
// const charactersError = 'Please enter the list of characters you would like'
const descriptionError = 'Please describe your idea'
const locationError = 'Please enter where on your body you would like the art'

export const bookingSchema = z.object({
  name: z.string({ required_error: nameError }).min(1, nameError),
  phoneNumber: z
    .string()
    .min(1, phoneNumberError)
    .regex(phoneRegex, phoneNumberRegexError),
  email: z.string().email({ message: emailError }),
  // characters: z.string().array().min(1, charactersError),
  description: z.string({ required_error: descriptionError }).min(1),
  location: z
    .string({
      required_error: locationError,
    })
    .min(1, locationError),
  style: z.string(),
  // priorTattoo: z.string(),
  // preferredDay: z.string(),
  referenceImages: z.custom<File[]>().superRefine((files, ctx) => {
    if (!files || files.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least 1 image must be provided',
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

export enum BookingField {
  Name = 'name',
  PhoneNumber = 'phoneNumber',
  Email = 'email',
  Description = 'description',
  Location = 'location',
  Style = 'style',
  ReferenceImages = 'referenceImages',
}
