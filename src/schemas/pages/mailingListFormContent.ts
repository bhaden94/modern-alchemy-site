import { defineField, defineType } from 'sanity'

export interface MailingListFormContent {
  isActive?: boolean
  formTitle?: string
  successMessage?: string
}

export default defineType({
  name: 'mailingListFormContent',
  type: 'object',
  title: 'Mailing List Form Content',
  fields: [
    defineField({
      name: 'isActive',
      type: 'boolean',
      title: 'Form Active Status',
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
