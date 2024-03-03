import { IconScript } from '@tabler/icons-react'
import { defineField, defineType } from 'sanity'

import { BaseSanitySchema } from '..'
import { BasePageContent } from './basePageContent'

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
      name: 'basePageContent',
      type: 'basePageContent',
      title: 'Base Page Content',
    }),
  ],
})
