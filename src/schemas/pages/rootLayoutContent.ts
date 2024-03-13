import { IconLayout } from '@tabler/icons-react'
import { defineField, defineType } from 'sanity'

import { ImageReference } from '~/utils/images/uploadImagesToSanity'

import { BaseSanitySchema } from '..'

export interface RootLayoutContent
  extends BaseSanitySchema<'rootLayoutContent'> {
  businessLogo: ImageReference
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'copyrightText',
      type: 'string',
      title: 'Copyright Text',
      validation: (Rule) =>
        Rule.required().custom((text) => {
          return text?.includes('{currentYear}')
            ? true
            : 'The copyright should include the {currentYear} literal in it.'
        }),
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
