import { IconFileCode } from '@tabler/icons-react'
import { defineField, defineType,ImageAsset } from 'sanity'

import { BaseSanitySchema } from '..'

export interface LayoutMetadataContent
  extends BaseSanitySchema<'layoutMetadataContent'> {
  businessName: string
  description: string
  openGraphImage?: { asset: ImageAsset }
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
    defineField({
      name: 'openGraphImage',
      type: 'image',
      title: 'Open Graph Image',
    }),
  ],
})
