import { defineArrayMember, defineType, PortableTextBlock } from 'sanity'

import { ImageReference } from '~/lib/sanity/sanity.image'

export interface BlockContentImage extends ImageReference {
  altText?: string
}

export type BlockContent = PortableTextBlock[]

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */
export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            name: 'internalLink',
            type: 'object',
            title: 'Internal link',
            description:
              'This can be used as a mailto link as well. Make sure the value starts with mailto for this.',
            fields: [
              {
                name: 'page',
                type: 'string',
                title: 'Page Link',
              },
            ],
          },
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
              {
                title: 'Open in new tab',
                name: 'blank',
                description: 'Read https://css-tricks.com/use-target_blank/',
                type: 'boolean',
              },
            ],
          },
        ],
      },
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
    }),
    defineArrayMember({
      type: 'image',
      fields: [{ name: 'altText', type: 'string', title: 'Image Alt Text' }],
    }),
  ],
})
