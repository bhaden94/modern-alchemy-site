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
