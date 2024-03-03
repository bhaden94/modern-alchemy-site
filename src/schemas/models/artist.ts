import { IconUsers } from '@tabler/icons-react'
import {
  defineArrayMember,
  defineField,
  defineType,
  ImageAsset,
  TypedObject,
} from 'sanity'

import { BaseSanitySchema } from '..'

export interface Artist extends BaseSanitySchema<'artist'> {
  email: string
  name: string
  booksOpen: boolean
  booksOpenAt?: Date | null
  shouldEmailBookings: boolean
  isActive: boolean
  externalBookingLink?: string
  socials?: { label: string; link: string }[]
  bookingInstructions?: TypedObject | TypedObject[]
  booksClosedMessage?: TypedObject | TypedObject[]
  portfolioImages?: { asset: ImageAsset }[]
  headshot?: { asset: ImageAsset }
  styles?: string[]
}

export default defineType({
  name: 'artist',
  type: 'document',
  title: 'Artist',
  icon: IconUsers,
  fields: [
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      type: 'boolean',
      title: 'Is Active',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shouldEmailBookings',
      type: 'boolean',
      title: 'Email Bookings',
      description:
        'If enabled, artist will get all bookings sent to their email.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'socials',
      type: 'array',
      title: 'Social Links',
      of: [
        defineArrayMember({
          title: 'Social Link',
          type: 'object',
          name: 'socialLink',
          fields: [
            {
              name: 'label',
              type: 'string',
              title: 'Label',
            },
            {
              name: 'link',
              type: 'string',
              title: 'Link',
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'booksOpen',
      type: 'boolean',
      description: 'Artists books status',
      title: 'Books Open',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'booksOpenAt',
      type: 'datetime',
      title: 'Books Open At',
    }),
    defineField({
      name: 'bookingInstructions',
      title: 'Booking Instructions',
      type: 'blockContent',
    }),
    defineField({
      name: 'booksClosedMessage',
      title: 'Booking Closed Message',
      type: 'blockContent',
    }),
    defineField({
      name: 'headshot',
      type: 'image',
      title: 'Headshot',
    }),
    defineField({
      name: 'styles',
      type: 'array',
      title: 'Styles',
      of: [
        defineArrayMember({
          title: 'Style',
          type: 'string',
          name: 'style',
        }),
      ],
    }),
    defineField({
      name: 'portfolioImages',
      type: 'array',
      title: 'Portfolio Images',
      of: [
        defineArrayMember({
          title: 'Image',
          type: 'image',
          name: 'image',
        }),
      ],
    }),
    defineField({
      name: 'externalBookingLink',
      type: 'string',
      title: 'External Booking Link',
    }),
  ],
})
