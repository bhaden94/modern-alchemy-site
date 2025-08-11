import { IconUsers } from '@tabler/icons-react'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { AuthorizedRoles, SanitySchemaRoles } from '~/lib/next-auth/auth.utils'
import { ImageReference } from '~/utils/images/uploadImagesToSanity'

import { BaseSanitySchema } from '..'
import { BlockContent } from './blockContent'

// TODO: Explicit choice for what shows on the booking page.
// We currently have a hierarchy of choices. The order if provided is externalBookingLink -> embeddedWidget -> then tattoo form
// We should have a choice so all these can be provided at the same time, but only one is chosen
// This also gives us flexibility to add more options in the future without needing complex boolean checks.

export interface Artist extends BaseSanitySchema<'artist'> {
  email: string
  name: string
  booksOpen: boolean
  booksOpenAt?: Date | null
  shouldEmailBookings: boolean
  isActive: boolean
  role: AuthorizedRoles
  externalBookingLink?: string
  socials?: { label: string; link: string }[]
  bookingInstructions?: BlockContent
  embeddedWidget?: {
    scriptSrc: string
    querySelector: string // CSS class name where the widget will be embedded
  }
  booksClosedMessage?: BlockContent
  portfolioImages?: ImageReference[]
  headshot?: ImageReference
  styles?: string[]

  // Form field settings
  availableDays?: string[]
  budgetOptions?: string[]
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
      name: 'role',
      type: 'string',
      title: 'Role',
      options: {
        list: SanitySchemaRoles,
      },
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
    defineField({
      name: 'embeddedWidget',
      type: 'object',
      title: 'Embedded Booking Widget',
      fields: [
        {
          name: 'scriptSrc',
          type: 'string',
          title: 'Script Src',
          validation: (Rule) => Rule.required().uri(),
        },
        {
          name: 'querySelector',
          type: 'string',
          title: 'Query Selector',
          validation: (Rule) => Rule.required(),
        },
      ],
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
    defineField({
      name: 'budgetOptions',
      type: 'array',
      title: 'Budget Options',
      of: [
        defineArrayMember({
          name: 'option',
          type: 'string',
          title: 'Option',
        }),
      ],
    }),
  ],
})
