import { IconBook } from '@tabler/icons-react'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { ImageReference } from '~/lib/sanity/sanity.image'

import { BaseSanitySchema } from '..'

export interface GenericBooking extends BaseSanitySchema<'genericBooking'> {
  name: string
  phoneNumber: string
  email: string
  description: string
  referenceImages: ImageReference[]
  preferredCommunicationMethod?: 'email' | 'phone'
  artist: any
}

export default defineType({
  name: 'genericBooking',
  type: 'document',
  title: 'Generic Booking',
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
      name: 'description',
      type: 'text',
      title: 'Description',
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
      name: 'preferredCommunicationMethod',
      type: 'string',
      title: 'Preferred Communication Method',
      options: {
        list: [
          { title: 'Email', value: 'email' },
          { title: 'Phone', value: 'phone' },
        ],
      },
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
