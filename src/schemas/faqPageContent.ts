import { defineArrayMember, defineField, defineType } from 'sanity'

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
