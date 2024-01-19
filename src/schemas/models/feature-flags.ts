import { defineField, defineType } from 'sanity'

import { BaseSanitySchema } from '..'

export interface FeatureFlag extends BaseSanitySchema<'featureFlag'> {
  title: string
  key: string
  description?: string
  status: boolean
}

export default defineType({
  title: 'Feature Flag',
  name: 'featureFlag',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'key',
      type: 'string',
      title: 'The key used to turn off/on features in the front-end',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      description: 'Description of the feature',
    }),
    defineField({
      name: 'status',
      type: 'boolean',
      description: 'Disable or enable the feature',
      title: 'Enabled / disabled?',
    }),
  ],
})
