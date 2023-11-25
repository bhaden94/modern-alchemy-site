import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'allowedUser',
  type: 'document',
  title: 'Allowed User',
  fields: [
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email',
    }),
  ],
})
