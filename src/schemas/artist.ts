import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'artist',
  type: 'document',
  title: 'Artist',
  fields: [
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email',
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
    }),
    defineField({
      name: 'instagram',
      type: 'string',
      title: 'Instagram',
    }),
    defineField({
      name: 'booksOpen',
      type: 'boolean',
      description: 'Artists books status',
      title: 'Books Open',
    }),
    defineField({
      name: 'booksOpenAt',
      type: 'datetime',
      title: 'Books Open At',
    }),
    defineField({
      name: 'headshot',
      type: 'image',
      title: 'Headshot',
    }),
    defineField({
      name: 'styles',
      type: 'array',
      title: 'Styles',
      of: [
        defineArrayMember({
          title: 'Style',
          type: 'string',
          name: 'style',
        }),
      ],
    }),
    defineField({
      name: 'portfolioImages',
      type: 'array',
      title: 'Portfolio Images',
      of: [
        defineArrayMember({
          title: 'Image',
          type: 'image',
          name: 'image',
        }),
      ],
    }),
    defineField({
      name: 'role',
      type: 'string',
      title: 'Role',
      options: {
        list: [
          { title: 'Owner', value: 'owner' },
          { title: 'Employee', value: 'employee' },
        ],
      },
    }),
  ],
})
