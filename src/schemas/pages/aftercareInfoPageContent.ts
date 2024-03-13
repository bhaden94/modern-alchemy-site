import { IconScript } from '@tabler/icons-react'
import { defineField, defineType } from 'sanity'

import { BaseSanitySchema } from '..'
import { BlockContent } from '../models/blockContent'
import { BasePageContent } from './basePageContent'

export interface AftercareInfoPageContent
  extends BaseSanitySchema<'aftercareInfoPageContent'>,
    BasePageContent {
  information?: BlockContent
}

export default defineType({
  name: 'aftercareInfoPageContent',
  type: 'document',
  title: 'Aftercare Info Page Content',
  icon: IconScript,
  fields: [
    defineField({
      name: 'basePageContent',
      type: 'basePageContent',
      title: 'Base Page Content',
    }),
    defineField({
      name: 'information',
      title: 'Information',
      type: 'blockContent',
    }),
  ],
})
