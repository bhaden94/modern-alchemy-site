import { defineArrayMember,defineField, defineType } from 'sanity'

export default defineType({
  name: 'booking',
  type: 'document',
  title: 'Booking',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'First/Last Name',
    }),
    defineField({
      name: 'phone_number',
      type: 'string',
      title: 'Phone Number',
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email',
    }),
    defineField({
      name: 'characters',
      type: 'string',
      title: 'Character List',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
    }),
    defineField({
      name: 'location',
      type: 'string',
      title: 'Location of Tattoo',
    }),
    defineField({
      name: 'style',
      type: 'string',
      title: 'Style',
      options: {
        list: [
          { title: 'Color', value: 'color' },
          { title: 'Black and Grey', value: 'black_and_grey' },
        ],
      },
    }),
    defineField({
      name: 'prior_tattoo',
      type: 'string',
      title: 'Have you been tattooed by Larry before',
      options: {
        list: [
          { title: 'No', value: 'no' },
          { title: 'Yes - I want a new tattoo', value: 'new_tattoo' },
          {
            title: 'Yes - this is an ongoing project',
            value: 'ongoing_project',
          },
        ],
      },
    }),
    defineField({
      name: 'preferred_day',
      type: 'string',
      title: 'Preferred days of appointment',
      options: {
        list: [
          { title: 'Monday', value: 'monday' },
          { title: 'Tuesday', value: 'tuesday' },
          { title: 'Wednesday', value: 'wednesday' },
          { title: 'Thursday', value: 'thursday' },
          { title: 'Friday', value: 'friday' },
        ],
      },
    }),
    defineField({
      name: 'showcaseImages',
      type: 'array',
      title: 'Showcased Images',
      of: [
        defineArrayMember({
          title: 'Image',
          type: 'image',
          name: 'image',
        }),
      ],
    }),
  ],
})
