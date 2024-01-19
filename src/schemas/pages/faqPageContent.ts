import { defineArrayMember, defineField, defineType, TypedObject } from 'sanity'

import { BasePageContent, BaseSanitySchema } from '..'

interface Faq {
  question: string
  answer: TypedObject | TypedObject[]
}

export interface FaqPageContent
  extends BaseSanitySchema<'faqPageContent'>,
    BasePageContent {
  faqs: Faq[]
}

export default defineType({
  name: 'faqPageContent',
  type: 'document',
  title: 'FAQ Page Text',
  fields: [
    defineField({
      name: 'pageTitle',
      type: 'string',
      title: 'Page Title',
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
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'blockContent',
            }),
          ],
        }),
      ],
    }),
  ],
})
