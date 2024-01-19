import { defineField, defineType } from 'sanity'

import { BasePageContent, BaseSanitySchema } from '..'

export interface ArtistsPageContent
  extends BaseSanitySchema<'artistsPageContent'>,
    BasePageContent {}

export default defineType({
  name: 'artistsPageContent',
  type: 'document',
  title: 'Artists Page Text',
  fields: [
    defineField({
      name: 'pageTitle',
      type: 'string',
      title: 'Page Title',
    }),
  ],
})
