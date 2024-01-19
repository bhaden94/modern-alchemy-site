import { defineField, defineType } from 'sanity'

import { BasePageContent, BaseSanitySchema } from '..'

export interface RootPageContent
  extends BaseSanitySchema<'rootPageContent'>,
    BasePageContent {
  heroDescription?: string
  heroButtonText?: string
  heroButtonLink?: string
  homeContent?: string
}

export default defineType({
  name: 'rootPageContent',
  type: 'document',
  title: 'Root Page Text',
  fields: [
    defineField({
      name: 'pageTitle',
      type: 'string',
      title: 'Page Title',
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
      name: 'homeContent',
      type: 'string',
      title: 'Home Content',
    }),
  ],
})
