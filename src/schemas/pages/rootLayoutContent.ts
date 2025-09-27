import { IconLayout } from '@tabler/icons-react'
import {
  defineArrayMember,
  defineField,
  defineType,
  RuleBuilder,
  StringRule,
} from 'sanity'

import { ImageReference } from '~/utils/images/uploadImagesToSanity'

import { BaseSanitySchema } from '..'

interface BaseNavigationLink {
  label: string
}
export interface NavigationLink extends BaseNavigationLink {
  link: string
}

export interface NestedNavigationLink extends BaseNavigationLink {
  links: NavigationLink[]
}

export type NavigationItem = NavigationLink | NestedNavigationLink

export interface Announcement {
  isActive: boolean
  title: string
}

export interface RootLayoutContent
  extends BaseSanitySchema<'rootLayoutContent'> {
  businessLogo: ImageReference
  copyrightText: string
  businessLogoCaption?: string[]
  instagramLink?: string
  facebookLink?: string
  navigationItems?: NavigationItem[]
  announcement?: Announcement
  googleTagManagerId?: string
}

const linkValidation = (
  Rule: StringRule,
  required: boolean = false,
): RuleBuilder<StringRule, string> =>
  Rule.lowercase().custom((text: string | undefined) => {
    if (!text) return required ? 'Required' : true
    return text.startsWith('/') ? true : 'Link must start with a /'
  })

export default defineType({
  name: 'rootLayoutContent',
  type: 'document',
  title: 'Root Layout Content',
  icon: IconLayout,
  fields: [
    defineField({
      name: 'businessLogo',
      type: 'image',
      title: 'Business Logo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'copyrightText',
      type: 'string',
      title: 'Copyright Text',
      validation: (Rule) =>
        Rule.required().custom((text: string | undefined) => {
          return text?.includes('{currentYear}')
            ? true
            : 'The copyright should include the {currentYear} literal in it.'
        }),
    }),
    defineField({
      name: 'businessLogoCaption',
      type: 'array',
      title: 'Business Logo Caption',
      of: [
        defineArrayMember({
          title: 'Line',
          type: 'string',
          name: 'line',
        }),
      ],
    }),
    defineField({
      name: 'instagramLink',
      type: 'string',
      title: 'Instagram Link',
    }),
    defineField({
      name: 'facebookLink',
      type: 'string',
      title: 'Facebook Link',
    }),
    defineField({
      name: 'navigationItems',
      type: 'array',
      title: 'Navigation Items',
      of: [
        defineArrayMember({
          title: 'Navigation Item',
          type: 'object',
          name: 'navigationItem',
          validation: (Rule) =>
            Rule.custom((field: unknown) => {
              if (!field) return true

              const fields = field as NavigationItem
              const link = 'link' in fields ? fields.link : undefined
              const links = 'links' in fields ? fields.links : undefined

              if (!link && (!links || links.length === 0)) {
                return 'Either a Link must be given or Links must contain at least one item.'
              }

              if (link && links && links.length > 0) {
                return 'Choose to use only the links array or the link field, not both.'
              }

              return true
            }),
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              title: 'Label',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'string',
              validation: (Rule) => linkValidation(Rule),
            }),
            defineField({
              name: 'links',
              type: 'array',
              title: 'Links',
              of: [
                defineArrayMember({
                  title: 'Link',
                  type: 'object',
                  name: 'link',
                  fields: [
                    defineField({
                      name: 'label',
                      type: 'string',
                      title: 'Label',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'link',
                      title: 'Link',
                      type: 'string',
                      validation: (Rule) => linkValidation(Rule, true),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'announcement',
      type: 'object',
      title: 'Announcement',
      fields: [
        defineField({
          name: 'isActive',
          type: 'boolean',
          title: 'Is Announcement Active?',
        }),
        defineField({
          name: 'title',
          type: 'string',
          title: 'Title',
        }),
      ],
    }),
    defineField({
      name: 'googleTagManagerId',
      type: 'string',
      title: 'Google Tag Manager ID',
    }),
  ],
})
