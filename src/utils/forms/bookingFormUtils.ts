import { ComboboxItem } from '@mantine/core'
import z from 'zod'

import { formatPhoneNumber } from '..'
import { ACCEPTED_IMAGE_TYPES, MAX_FILES_SIZE } from './FormConstants'

const joinPreferredDayLabels = (days: string[]): string => {
  if (days.length === 5) {
    return 'Any weekday'
  }

  const labels: string[] = []

  preferredDayOptions.forEach((option) => {
    if (days.includes(option.value)) {
      labels.push(option.label)
    }
  })

  return labels.join(', ')
}

const phoneRegex = new RegExp(
  /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
)

export const MIN_AGE = 18
export const MAX_AGE = 117
const MIN_FILES = 1
export const MAX_FILES = 5

export const TATTOO_STYLE = ['color', 'black_and_grey'] as const
export const zTattooStyle = z.enum(TATTOO_STYLE)
export const styleOptions: { value: string; label: string }[] = [
  {
    value: zTattooStyle.Values.color,
    label: 'Color',
  },
  {
    value: zTattooStyle.Values.black_and_grey,
    label: 'Black & Grey',
  },
]

export const PRIOR_TATTOO = ['no', 'new_tattoo', 'ongoing_project'] as const
export const zPriorTattoo = z.enum(PRIOR_TATTOO)
export const priorTattooOptions: { value: string; label: string }[] = [
  {
    value: zPriorTattoo.Values.no,
    label: 'No',
  },
  {
    value: zPriorTattoo.Values.new_tattoo,
    label: 'Yes - I want a new tattoo',
  },
  {
    value: zPriorTattoo.Values.ongoing_project,
    label: 'Yes - this is an ongoing project',
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

const nameError = 'Please enter your full name'
const phoneNumberRegexError = 'Invalid phone number'
const phoneNumberError = 'Please enter your phone number'
const emailError = 'Invalid email address'
const travelingFromError = 'Please enter where you are coming from'
const minAgeError = 'You must be at least 18 to get a tattoo'
const maxAgeError = 'Congrats on being the oldest person in history!'
const charactersError = 'Please enter the list of characters you would like'
const descriptionError = 'Please describe your idea'
const locationError =
  'Please enter where on your body you would like the tattoo'
const preferredDayError = 'Please select at least 1 preferred day'

/*
Places to update for form changes:
  - TattooForm component
  - bookingFormUtils schema (this file)
  - bookingFormUtil BookingField object (this file)
  - booking sanity model schema
  - booking sanity model interface
*/

// Custom checks for images in booking form
const imagesRefinement = (files: File[], ctx: z.RefinementCtx): boolean => {
  if (!files || files.length < MIN_FILES) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `At least ${MIN_FILES} image(s) must be provided.`,
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

// Booking form schema
export const bookingSchema = z.object({
  name: z.string({ required_error: nameError }).min(1, nameError),
  phoneNumber: z
    .string()
    .min(1, phoneNumberError)
    .regex(phoneRegex, phoneNumberRegexError),
  email: z.string().email({ message: emailError }),
  instagramName: z.string().optional(),
  travelingFrom: z
    .string({ required_error: travelingFromError })
    .min(1, travelingFromError),
  age: z.coerce
    .number()
    .int()
    .gte(MIN_AGE, minAgeError)
    .lte(MAX_AGE, maxAgeError),
  characters: z
    .string({ required_error: charactersError })
    .min(1, charactersError),
  description: z
    .string({ required_error: descriptionError })
    .min(1, descriptionError),
  location: z
    .string({
      required_error: locationError,
    })
    .min(1, locationError),
  style: zTattooStyle,
  priorTattoo: zPriorTattoo,
  preferredDays: z
    .string({ required_error: preferredDayError })
    .array()
    .min(1, preferredDayError),
  bodyPlacementImages: z.custom<File[]>().superRefine(imagesRefinement),
  referenceImages: z.custom<File[]>().superRefine(imagesRefinement),
})

// extracting the type
export type TBookingSchema = z.infer<typeof bookingSchema>

// This object is used just for the booking form
// There are 2 image upload fields that get combined
// into a single array of referenceImages for the booking
export const ImagesBookingField = {
  BodyPlacementImages: {
    id: 'bodyPlacementImages',
    label:
      'Please add a clear photo of where you would like your tattoo placed',
    description:
      'Make sure its a photo of you and not a photo from the internet.',
    initialValue: [],
  },
  ReferenceImages: {
    id: 'referenceImages',
    label: 'Please add reference photos for your tattoo design',
    description: '',
    initialValue: [],
  },
} as const

// This object controls what appears on the artists bookings page.
// Each top level property will get turned into a field.
// It is also partially used in the form submissions,
// but is not directly tied to the form schema above.
export const BookingField = {
  Name: {
    id: 'name',
    label: 'First and Last Name',
    placeholder: 'Enter your full name',
    initialValue: '',
    getValue: (name: string) => name,
  },
  PhoneNumber: {
    id: 'phoneNumber',
    label: 'Phone Number',
    placeholder: 'Enter your phone number',
    initialValue: '',
    getValue: (number: string) => formatPhoneNumber(number) || '',
  },
  Email: {
    id: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    initialValue: '',
    getValue: (email: string) => email,
  },
  InstagramName: {
    id: 'instagramName',
    label: 'Instagram Name',
    placeholder: 'Enter your Instagram if you would like',
    initialValue: '',
    getValue: (name: string) => name,
  },
  TravelingFrom: {
    id: 'travelingFrom',
    label: 'Where are you traveling from?',
    placeholder: 'Enter the city and state',
    initialValue: '',
    getValue: (destination: string) => destination,
  },
  Age: {
    id: 'age',
    label: 'Age',
    placeholder: 'Example: 18',
    initialValue: MIN_AGE,
    getValue: (age: string) => age,
  },
  Characters: {
    id: 'characters',
    label: 'Characters or Subject',
    placeholder: 'Example: Vegeta from DBZ',
    initialValue: '',
    getValue: (characters: string) => characters,
  },
  Location: {
    id: 'location',
    label: 'Location of Tattoo',
    placeholder: 'Example: left inner forearm',
    initialValue: '',
    getValue: (location: string) => location,
  },
  Style: {
    id: 'style',
    label: 'Tattoo Style',
    initialValue: styleOptions[0].value,
    getValue: (style: string) =>
      styleOptions.find((option) => option.value === style)?.label || 'No',
  },
  PriorTattoo: {
    id: 'priorTattoo',
    label: 'Have you been tattooed by Larry before?',
    initialValue: priorTattooOptions[0].value,
    getValue: (item: string) =>
      priorTattooOptions.find((option) => option.value === item)?.label || 'No',
  },
  PreferredDays: {
    id: 'preferredDays',
    label: 'Preferred days of Appointment',
    initialValue: [],
    getValue: (days: string[]) => joinPreferredDayLabels(days),
  },
  Description: {
    id: 'description',
    label: 'Description of your tattoo idea',
    placeholder: 'Character portrait, action pose, bust or waist up.',
    initialValue: '',
    getValue: (description: string) => description,
  },
  ReferenceImages: {
    id: 'referenceImages',
    label: 'Reference Images',
    initialValue: [],
    getValue: () => '',
  },
} as const

export const getBookingFormInitialValues = (): TBookingSchema => {
  const bookingFormInitialValues: any = {}

  Object.values(BookingField).forEach((field) => {
    bookingFormInitialValues[field.id] = field.initialValue
  })

  Object.values(ImagesBookingField).forEach((field) => {
    bookingFormInitialValues[field.id] = field.initialValue
  })

  return bookingFormInitialValues as TBookingSchema
}
