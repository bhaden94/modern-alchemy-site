import { ComboboxItem } from '@mantine/core'
import z from 'zod'

import { Artist } from '~/schemas/models/artist'

import { formatPhoneNumber } from '..'
import { ACCEPTED_IMAGE_TYPES, MAX_FILES_SIZE } from './FormConstants'

const joinPreferredDayLabels = (days: string[]): string => {
  if (days.length === bookingDayChoices.length) {
    return 'Any day'
  }

  const labels: string[] = []

  bookingDayChoices.forEach((option) => {
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

const zTattooStyle = z.enum(['color', 'black_and_grey'])
type TTattooStyle = z.infer<typeof zTattooStyle>
export const styleOptions: { value: TTattooStyle; label: string }[] = [
  {
    value: 'color',
    label: 'Color',
  },
  {
    value: 'black_and_grey',
    label: 'Black & Grey',
  },
]

const zPriorTattoo = z.enum(['no', 'new_tattoo', 'ongoing_project'])
type TPriorTattoo = z.infer<typeof zPriorTattoo>
export const priorTattooOptions: { value: TPriorTattoo; label: string }[] = [
  {
    value: 'no',
    label: 'No',
  },
  {
    value: 'new_tattoo',
    label: 'Yes - I want a new tattoo',
  },
  {
    value: 'ongoing_project',
    label: 'Yes - this is an ongoing project',
  },
]

export const bookingDayChoices: ComboboxItem[] = [
  {
    value: 'sunday',
    label: 'Sunday',
  },
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
  {
    value: 'saturday',
    label: 'Saturday',
  },
]

export const getArtistAvailableDays = (
  artistAvailability: string[] | null | undefined,
): ComboboxItem[] => {
  if (
    !artistAvailability ||
    artistAvailability.length === 0 ||
    artistAvailability.length === bookingDayChoices.length
  ) {
    return bookingDayChoices
  }

  // Filter out days that are not in the artist's availability
  return bookingDayChoices.filter((day) =>
    artistAvailability.includes(day.value),
  )
}

const nameError = 'Please enter your full name'
const phoneNumberRegexError = 'Invalid phone number'
const phoneNumberError = 'Please enter your phone number'
const emailError = 'Invalid email address'
const travelingFromError = 'Please enter where you are coming from'
const minAgeError = 'You must be at least 18 to get a tattoo'
const maxAgeError = 'Congrats on being the oldest person in history!'
const charactersError = 'Please enter the list of characters you would like'
const budgetError = 'Please select a budget/session length option'
const descriptionError = 'Please describe your idea'
const locationError =
  'Please enter where on your body you would like the tattoo'
const preferredDayError = 'Please select at least 1 preferred day'

/*
Places to update for form changes:
  - TattooForm component
  - bookingFormUtil generateBookingFormSchema function (this file)
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

// Generated a schema given an artist
export const generateBookingFormSchema = (artist: Artist): z.ZodObject<any> => {
  return z.object({
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
    budget: z
      .string()
      .optional()
      .refine(
        (value) => {
          // if budgetOptions is defined and length is greater than 0,
          // then the budget field is required and should be one of the options chosen
          if (artist.budgetOptions && artist.budgetOptions.length > 0) {
            return value && artist.budgetOptions.includes(value)
          }

          return true
        },
        {
          message: budgetError,
        },
      ),
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
}

// extracting the type
export type TBookingSchema = {
  name: string
  phoneNumber: string
  email: string
  instagramName?: string | undefined
  travelingFrom: string
  age: number
  characters: string
  budget?: string | undefined
  description: string
  location: string
  style: TTattooStyle
  priorTattoo: TPriorTattoo
  preferredDays: string[]
  bodyPlacementImages: File[]
  referenceImages: File[]
}

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
  Budget: {
    id: 'budget',
    label: 'Budget/Session length',
    initialValue: '',
    getValue: (budget: string) => budget,
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
