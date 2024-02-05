import { IconFileCode } from '@tabler/icons-react'
import { defineField, defineType } from 'sanity'

import { BaseSanitySchema } from '..'

export interface LayoutMetadataContent
  extends BaseSanitySchema<'layoutMetadataContent'> {
  businessName: string
  description: string
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
    }),
    defineField({
      name: 'description',
      type: 'string',
      title: 'Description',
    }),
  ],
})
