import { IconFileCode } from '@tabler/icons-react'
import { defineField, defineType } from 'sanity'

import { ImageReference } from '~/utils/images/uploadImagesToSanity'

import { BaseSanitySchema } from '..'

export interface LayoutMetadataContent
  extends BaseSanitySchema<'layoutMetadataContent'> {
  businessName: string
  location: string
  description?: string
  openGraphImage?: ImageReference
}

export default defineType({
  name: 'layoutMetadataContent',
  type: 'document',
  title: 'Layout Metadata',
  icon: IconFileCode,
  fields: [
    defineField({
      name: 'businessName',
      type: 'string',
      title: 'Business Name',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      type: 'string',
      title: 'Location',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'string',
      title: 'Description',
    }),
    defineField({
      name: 'openGraphImage',
      type: 'image',
      title: 'Open Graph Image',
    }),
  ],
})
