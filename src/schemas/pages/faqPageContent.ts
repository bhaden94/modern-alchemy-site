import { IconScript } from '@tabler/icons-react'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { BaseSanitySchema } from '..'
import { BlockContent } from '../models/blockContent'
import { BasePageContent } from './basePageContent'

interface Faq {
  question: string
  answer: BlockContent
}

export interface FaqPageContent
  extends BaseSanitySchema<'faqPageContent'>,
    BasePageContent {
  faqs?: Faq[]
}

export default defineType({
  name: 'faqPageContent',
  type: 'document',
  title: 'FAQ Page Content',
  icon: IconScript,
  fields: [
    defineField({
      name: 'basePageContent',
      type: 'basePageContent',
      title: 'Base Page Content',
    }),
    defineField({
      name: 'faqs',
      type: 'array',
      title: 'FAQs',
      of: [
        defineArrayMember({
          title: 'FAQ',
          type: 'object',
          name: 'faq',
          fields: [
            defineField({
              name: 'question',
              type: 'string',
              title: 'Question',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'blockContent',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
})
