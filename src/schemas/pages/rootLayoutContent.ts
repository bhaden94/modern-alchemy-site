import { defineField, defineType, ImageAsset } from 'sanity'

import { BaseSanitySchema } from '..'

export interface RootLayoutContent
  extends BaseSanitySchema<'rootLayoutContent'> {
  businessLogo: { asset: ImageAsset }
  copywriteText: string
  businessLogoCaption?: string
  intagramLink?: string
  facebookLink?: string
}

export default defineType({
  name: 'rootLayoutContent',
  type: 'document',
  title: 'Root Layout Content',
  fields: [
    defineField({
      name: 'businessLogo',
      type: 'image',
      title: 'Business Logo',
    }),
    defineField({
      name: 'copywriteText',
      type: 'string',
      title: 'Copywrite Text',
    }),
    defineField({
      name: 'businessLogoCaption',
      type: 'string',
      title: 'Business Logo Caption',
    }),
    defineField({
      name: 'intagramLink',
      type: 'string',
      title: 'Instagram Link',
    }),
    defineField({
      name: 'facebookLink',
      type: 'string',
      title: 'Fecebook Link',
    }),
  ],
})
