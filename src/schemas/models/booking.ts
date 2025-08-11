import { IconBook } from '@tabler/icons-react'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { ImageReference } from '~/utils/images/uploadImagesToSanity'

import { BaseSanitySchema } from '..'

/*
Places to update for form changes:
  - TattooForm component
  - bookingFormUtil generateBookingFormSchema function
  - bookingFormUtil BookingField enum
  - booking sanity model schema (this file)
  - booking sanity model interface (this file)
*/

// TODO: Generic booking schema for other artist types

export interface Booking extends BaseSanitySchema<'booking'> {
  name: string
  phoneNumber: string
  email: string
  instagramName?: string
  travelingFrom: string
  age: number
  characters: string
  description: string
  location: string
  style: 'color' | 'black_and_grey'
  priorTattoo: 'no' | 'new_tattoo' | 'ongoing_project'
  preferredDays: string[]
  budget: string
  referenceImages: ImageReference[]
  artist: any
}

export default defineType({
  name: 'booking',
  type: 'document',
  title: 'Booking',
  icon: IconBook,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'First/Last Name',
    }),
    defineField({
      name: 'phoneNumber',
      type: 'string',
      title: 'Phone Number',
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email',
    }),
    defineField({
      name: 'instagramName',
      type: 'string',
      title: 'Instagram Name',
    }),
    defineField({
      name: 'travelingFrom',
      type: 'string',
      title: 'Traveling From',
    }),
    defineField({
      name: 'age',
      type: 'number',
      title: 'Age',
    }),
    defineField({
      name: 'characters',
      type: 'string',
      title: 'Character List',
    }),
    defineField({
      name: 'location',
      type: 'string',
      title: 'Location of Tattoo',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
    }),
    defineField({
      name: 'style',
      type: 'string',
      title: 'Style',
      options: {
        list: [
          { title: 'Color', value: 'color' },
          { title: 'Black and Grey', value: 'black_and_grey' },
        ],
      },
    }),
    defineField({
      name: 'priorTattoo',
      type: 'string',
      title: 'Have you been tattooed by Larry before',
      options: {
        list: [
          { title: 'No', value: 'no' },
          { title: 'Yes - I want a new tattoo', value: 'new_tattoo' },
          {
            title: 'Yes - this is an ongoing project',
            value: 'ongoing_project',
          },
        ],
      },
    }),
    defineField({
      name: 'preferredDays',
      type: 'array',
      title: 'Preferred days of appointment',
      of: [
        defineArrayMember({
          name: 'day',
          type: 'string',
          title: 'Preferred Day',
          options: {
            list: [
              { title: 'Sunday', value: 'sunday' },
              { title: 'Monday', value: 'monday' },
              { title: 'Tuesday', value: 'tuesday' },
              { title: 'Wednesday', value: 'wednesday' },
              { title: 'Thursday', value: 'thursday' },
              { title: 'Friday', value: 'friday' },
              { title: 'Saturday', value: 'saturday' },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'budget',
      type: 'string',
      title: 'Budget/Session length',
    }),
    defineField({
      name: 'referenceImages',
      type: 'array',
      title: 'Reference Images',
      of: [
        defineArrayMember({
          title: 'Image',
          type: 'image',
          name: 'image',
        }),
      ],
    }),
    defineField({
      name: 'artist',
      type: 'reference',
      title: 'Artist',
      weak: true,
      to: [{ type: 'artist' }],
    }),
  ],
})
