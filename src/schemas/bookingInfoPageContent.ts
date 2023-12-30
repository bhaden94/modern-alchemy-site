import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'bookingInfoPageContent',
  type: 'document',
  title: 'Booking Info Page Text',
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
