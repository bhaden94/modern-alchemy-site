import { IconScript } from '@tabler/icons-react'
import { defineField, defineType, TypedObject } from 'sanity'

import { BaseSanitySchema } from '..'
import { BasePageContent } from './basePageContent'

export interface PrivacyPolicyPageContent
  extends BaseSanitySchema<'privacyPolicyPageContent'>,
    BasePageContent {
  information?: TypedObject | TypedObject[]
}

export default defineType({
  name: 'privacyPolicyPageContent',
  type: 'document',
  title: 'Privacy Policy Page Content',
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
