import { IconUsers } from '@tabler/icons-react'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { ImageReference } from '~/utils/images/uploadImagesToSanity'

import { BaseSanitySchema } from '..'
import { BlockContent } from './blockContent'

export interface Artist extends BaseSanitySchema<'artist'> {
  email: string
  name: string
  booksOpen: boolean
  booksOpenAt?: Date | null
  shouldEmailBookings: boolean
  isActive: boolean
  externalBookingLink?: string
  socials?: { label: string; link: string }[]
  bookingInstructions?: BlockContent
  booksClosedMessage?: BlockContent
  portfolioImages?: ImageReference[]
  headshot?: ImageReference
  styles?: string[]

  // Form field settings
  availableDays?: string[]
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
      validation: (Rule) => Rule.required().lowercase(),
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

    // Form field settings
    defineField({
      name: 'availableDays',
      type: 'array',
      title: 'Available Days',
      of: [
        defineArrayMember({
          name: 'day',
          type: 'string',
          title: 'Day',
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
  ],
})
