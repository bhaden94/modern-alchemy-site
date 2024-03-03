import { IconScript } from '@tabler/icons-react'
import { defineField, defineType, TypedObject } from 'sanity'

import { BaseSanitySchema } from '..'
import { BasePageContent } from './basePageContent'

export interface BookingInfoPageContent
  extends BaseSanitySchema<'bookingInfoPageContent'>,
    BasePageContent {
  information?: TypedObject | TypedObject[]
}

export default defineType({
  name: 'bookingInfoPageContent',
  type: 'document',
  title: 'Booking Info Page Content',
  icon: IconScript,
  fields: [
    defineField({
      name: 'basePageContent',
      type: 'basePageContent',
      title: 'Base Page Content',
    }),
    defineField({
      name: 'information',
      title: 'Information',
      type: 'blockContent',
    }),
  ],
})
