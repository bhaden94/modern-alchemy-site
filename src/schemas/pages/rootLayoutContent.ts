import { IconLayout } from '@tabler/icons-react'
import { defineField, defineType, ImageAsset } from 'sanity'

import { BaseSanitySchema } from '..'

export interface RootLayoutContent
  extends BaseSanitySchema<'rootLayoutContent'> {
  businessLogo: { asset: ImageAsset }
  copyrightText: string
  businessLogoCaption?: string
  instagramLink?: string
  facebookLink?: string
}

export default defineType({
  name: 'rootLayoutContent',
  type: 'document',
  title: 'Root Layout Content',
  icon: IconLayout,
  fields: [
    defineField({
      name: 'businessLogo',
      type: 'image',
      title: 'Business Logo',
    }),
    defineField({
      name: 'copyrightText',
      type: 'string',
      title: 'Copyright Text',
    }),
    defineField({
      name: 'businessLogoCaption',
      type: 'string',
      title: 'Business Logo Caption',
    }),
    defineField({
      name: 'instagramLink',
      type: 'string',
      title: 'Instagram Link',
    }),
    defineField({
      name: 'facebookLink',
      type: 'string',
      title: 'Facebook Link',
    }),
  ],
})
