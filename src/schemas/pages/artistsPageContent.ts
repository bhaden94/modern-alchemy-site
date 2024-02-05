import { IconScript } from '@tabler/icons-react'
import { defineField, defineType } from 'sanity'

import { BasePageContent, BaseSanitySchema } from '..'

export interface ArtistsPageContent
  extends BaseSanitySchema<'artistsPageContent'>,
    BasePageContent {}

export default defineType({
  name: 'artistsPageContent',
  type: 'document',
  title: 'Artists Page Content',
  icon: IconScript,
  fields: [
    defineField({
      name: 'pageTitle',
      type: 'string',
      title: 'Page Title',
    }),
    defineField({
      name: 'isActive',
      type: 'boolean',
      title: 'Page Active Status',
    }),
  ],
})
