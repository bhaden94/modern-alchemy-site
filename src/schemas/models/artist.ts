import { IconUsers } from '@tabler/icons-react'
import {
  defineArrayMember,
  defineField,
  defineType,
  ImageAsset,
  TypedObject,
} from 'sanity'

import { BaseSanitySchema } from '..'

export enum Role {
  OWNER = 'owner',
  EMPLOYEE = 'employee',
}

export interface Artist extends BaseSanitySchema<'artist'> {
  email: string
  name: string
  socials?: { label: string; link: string }[]
  booksOpen: boolean
  booksOpenAt: Date | null
  bookingInstructions?: TypedObject | TypedObject[]
  headshot?: { asset: ImageAsset }
  styles?: string[]
  portfolioImages?: { asset: ImageAsset }[]
  role: Role
  shouldEmailBookings: boolean
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
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
    }),
    defineField({
      name: 'shouldEmailBookings',
      type: 'boolean',
      title: 'Email Bookings',
      description:
        'If enabled, artist will get all bookings sent to their email.',
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
              title: 'Lable',
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
      name: 'role',
      type: 'string',
      title: 'Role',
      options: {
        list: [
          { title: 'Owner', value: 'owner' },
          { title: 'Employee', value: 'employee' },
        ],
      },
    }),
  ],
})
