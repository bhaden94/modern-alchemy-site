import { defineField, defineType, TypedObject } from 'sanity'

import { BasePageContent, BaseSanitySchema } from '..'

export interface BookingInfoPageContent
  extends BaseSanitySchema<'bookingInfoPageContent'>,
    BasePageContent {
  information: TypedObject | TypedObject[]
}

export default defineType({
  name: 'bookingInfoPageContent',
  type: 'document',
  title: 'Booking Info Page Content',
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
