import { defineField, defineType } from 'sanity'

export interface BasePageContent {
  pageTitle: string
  isActive: boolean
  metadataDescription?: string
}

export default defineType({
  name: 'basePageContent',
  type: 'object',
  title: 'Base Page Content',
  fields: [
    defineField({
      name: 'pageTitle',
      type: 'string',
      title: 'Page Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      type: 'boolean',
      title: 'Page Active Status',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metadataDescription',
      type: 'string',
      title: 'Metadata Description',
    }),
  ],
})
