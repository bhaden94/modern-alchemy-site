import { IconScript } from '@tabler/icons-react'
import { defineField, defineType } from 'sanity'

import { BaseSanitySchema } from '..'
import { BasePageContent } from './basePageContent'

export interface BlogPageContent
  extends BaseSanitySchema<'blogPageContent'>,
    BasePageContent {}

export default defineType({
  name: 'blogPageContent',
  type: 'document',
  title: 'Blog Page Content',
  icon: IconScript,
  fields: [
    defineField({
      name: 'basePageContent',
      type: 'basePageContent',
      title: 'Base Page Content',
    }),
  ],
})
