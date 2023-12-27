import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'rootPageContent',
  type: 'document',
  title: 'Root Page Text',
  fields: [
    defineField({
      name: 'heroTitle',
      type: 'string',
      title: 'Hero Title',
    }),
    defineField({
      name: 'heroDescription',
      type: 'string',
      title: 'Hero Description',
    }),
    defineField({
      name: 'homeContent',
      type: 'string',
      title: 'Home Content',
    }),
  ],
})
