import { defineField, defineType, TypedObject } from 'sanity'

import { BasePageContent, BaseSanitySchema } from '..'

export interface AftercareInfoPageContent
  extends BaseSanitySchema<'aftercareInfoPageContent'>,
    BasePageContent {
  information: TypedObject | TypedObject[]
}

export default defineType({
  name: 'aftercareInfoPageContent',
  type: 'document',
  title: 'Aftercare Info Page Content',
  fields: [
    defineField({
      name: 'pageTitle',
      type: 'string',
      title: 'Page Title',
    }),
    defineField({
      name: 'isActive',
      type: 'boolean',
      title: 'Page Active Status',
    }),
    defineField({
      name: 'information',
      title: 'Information',
      type: 'blockContent',
    }),
  ],
})
