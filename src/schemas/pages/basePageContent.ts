import { defineField, defineType } from 'sanity'

export interface BasePageContent {
  pageTitle: string
  isActive: boolean
  metadataDescription?: string
  keywords?: string[]
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
    defineField({
      name: 'keywords',
      type: 'array',
      title: 'SEO Keywords',
      description:
        'Keywords for this page. Will be combined with location-based keywords.',
      of: [{ type: 'string' }],
    }),
  ],
})
