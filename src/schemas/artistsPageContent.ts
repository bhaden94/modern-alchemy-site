import { defineField, defineType } from 'sanity'

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
