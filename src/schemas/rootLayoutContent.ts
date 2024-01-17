import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'rootLayoutContent',
  type: 'document',
  title: 'Root Layout Content',
  fields: [
    defineField({
      name: 'businessLogo',
      type: 'image',
      title: 'Business Logo',
    }),
    defineField({
      name: 'copywriteText',
      type: 'string',
      title: 'Copywrite Text',
    }),
    defineField({
      name: 'businessLogoCaption',
      type: 'string',
      title: 'Business Logo Caption',
    }),
    defineField({
      name: 'intagramLink',
      type: 'string',
      title: 'Instagram Link',
    }),
    defineField({
      name: 'facebookLink',
      type: 'string',
      title: 'Fecebook Link',
    }),
  ],
})
