import { IconArticle } from '@tabler/icons-react'
import { defineField, defineType } from 'sanity'

import { ImageReference } from '~/utils/images/uploadImagesToSanity'

import { BaseSanitySchema, Slug } from '..'
import { Artist } from './artist'
import { BlockContent } from './blockContent'

export interface Blog extends BaseSanitySchema<'blog'> {
  coverImage?: ImageReference | null
  title?: string
  slug?: Slug
  content?: BlockContent
  publishedAt?: string | null
  updatedAt?: string
  artist: Artist
  state: 'draft' | 'published'
}

export default defineType({
  name: 'blog',
  type: 'document',
  title: 'Blog',
  icon: IconArticle,
  fields: [
    defineField({
      name: 'coverImage',
      type: 'image',
      title: 'Cover Image',
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (rule) =>
        rule.custom((value, context) => {
          const state = (context as any).document?.state
          if (state === 'published' && !value) {
            return 'Title is required when state is published'
          }
          return true
        }),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          const state = (context as any).document?.state
          if (state === 'published' && !value) {
            return 'Slug is required when state is published'
          }
          return true
        }),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      validation: (rule) =>
        rule.custom((value, context) => {
          const state = (context as any).document?.state
          if (state === 'published' && !value) {
            return 'Blog content is required when state is published'
          }
          return true
        }),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (rule) =>
        rule.custom((value, context) => {
          const state = (context as any).document?.state
          if (state === 'published' && !value) {
            return 'Published At is required when state is published'
          }
          return true
        }),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
    }),
    defineField({
      name: 'artist',
      type: 'reference',
      title: 'Artist',
      weak: true,
      to: [{ type: 'artist' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'state',
      title: 'State',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
})
