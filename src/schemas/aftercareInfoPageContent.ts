import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aftercareInfoPageContent',
  type: 'document',
  title: 'Aftercare Info Page Text',
  fields: [
    defineField({
      name: 'pageTitle',
      type: 'string',
      title: 'Page Title',
    }),
    defineField({
      name: 'information',
      title: 'Information',
      type: 'blockContent',
    }),
  ],
})
