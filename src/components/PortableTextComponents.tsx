import { Anchor, Image, Text } from '@mantine/core'
import {
  PortableTextMarkComponentProps,
  PortableTextReactComponents,
} from '@portabletext/react'
import Link from 'next/link'

import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { BlockContentImage } from '~/schemas/models/blockContent'

// TODO: clean up this file and split out into individual components.
// TODO: external link should follow same pattern as internal

interface InEditorProps {
  inEditor?: boolean
}

export interface InternalLinkMark {
  _type: 'internalLink'
  _key: string
  page: string
}

export const InternalLink: React.FC<
  PortableTextMarkComponentProps<InternalLinkMark> & InEditorProps
> = ({ value, children, inEditor = false }) => {
  const page = value?.page || ''
  const href = `/${encodeURIComponent(page)}`

  const anchorProps: { component?: any; href?: string; c?: string } = {}
  anchorProps.component = inEditor ? Text : Link
  // if (!inEditor) {
  //   anchorProps.href = href
  // }

  // TODO: Might need to change functionality here
  // When set to Text component, it still moves the page when clicked
  return (
    <Anchor
      {...anchorProps}
      href={inEditor ? undefined : href}
      c="primary"
      underline={inEditor ? 'always' : 'hover'}
    >
      {children}
    </Anchor>
  )
}

export type ExternalLinkMark = {
  _type: 'link'
  _key: string
  href: string
  blank?: boolean
}

export const ExternalLink: React.FC<
  PortableTextMarkComponentProps<ExternalLinkMark> & InEditorProps
> = ({ value, children }) => {
  const { blank, href } = value || { blank: false, href: '' }
  // Read https://css-tricks.com/use-target_blank/
  return blank ? (
    <Anchor href={href} c="primary" target="_blank" rel="noopener">
      {children}
    </Anchor>
  ) : (
    <Anchor href={href} c="primary">
      {children}
    </Anchor>
  )
}

export const PortableTextComponents: Partial<PortableTextReactComponents> = {
  marks: {
    internalLink: InternalLink,
    link: ExternalLink,
  },
  types: {
    image: ({ value }: { value: BlockContentImage }) => {
      return (
        <Image
          src={getImageFromRef(value)?.url}
          alt={value.altText}
          radius="var(--mantine-radius-default)"
        />
      )
    },
  },
}
