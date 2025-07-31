import { IconMail } from '@tabler/icons-react'
import { defineField, defineType } from 'sanity'

import { BaseSanitySchema } from '..'

export interface MailingListContent extends BaseSanitySchema<'mailingList'> {
  isActive?: boolean
  heroTitle?: string
  formTitle?: string
  successMessage?: string
}

export default defineType({
  name: 'mailingList',
  type: 'document',
  title: 'Mailing List Content',
  icon: IconMail,
  fields: [
    defineField({
      name: 'isActive',
      type: 'boolean',
      title: 'Form Active Status',
    }),
    defineField({
      name: 'heroTitle',
      type: 'string',
      title: 'Hero Title',
    }),
    defineField({
      name: 'formTitle',
      type: 'string',
      title: 'Form Title',
    }),
    defineField({
      name: 'successMessage',
      type: 'string',
      title: 'Success Message',
    }),
  ],
})
