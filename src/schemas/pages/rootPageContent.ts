import { IconScript } from '@tabler/icons-react'
import {
  defineArrayMember,
  defineField,
  defineType,
  ImageAsset,
  TypedObject,
} from 'sanity'

import { BaseSanitySchema } from '..'
import { BasePageContent } from './basePageContent'

export interface AboutContent {
  heading: string
  text: TypedObject | TypedObject[]
  image?: { asset: ImageAsset }
}

export interface RootPageContent
  extends BaseSanitySchema<'rootPageContent'>,
    BasePageContent {
  heroDescription?: string
  heroButtonText?: string
  heroButtonLink?: string
  aboutContent?: AboutContent[]
}

export default defineType({
  name: 'rootPageContent',
  type: 'document',
  title: 'Root Page Content',
  icon: IconScript,
  fields: [
    defineField({
      name: 'basePageContent',
      type: 'basePageContent',
      title: 'Base Page Content',
    }),
    defineField({
      name: 'heroDescription',
      type: 'string',
      title: 'Hero Description',
    }),
    defineField({
      name: 'heroButtonText',
      type: 'string',
      title: 'Hero Button Text',
    }),
    defineField({
      name: 'heroButtonLink',
      type: 'string',
      title: 'Hero Button Link',
    }),
    defineField({
      name: 'aboutContent',
      type: 'array',
      title: 'About Content',
      of: [
        defineArrayMember({
          title: 'About Item',
          type: 'object',
          name: 'aboutItem',
          fields: [
            {
              name: 'heading',
              type: 'string',
              title: 'Heading',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'text',
              type: 'blockContent',
              title: 'Text',
              validation: (Rule) => Rule.required(),
            },
            // images uploaded here should be in the below format:
            //  - aspect ration 4:3
            //  - have pre-rounded corners
            //  - be compressed
            // Online tools can be used to do this.
            {
              name: 'image',
              type: 'image',
              title: 'Image',
            },
          ],
        }),
      ],
    }),
  ],
})
