import { AnchorProps, Image } from '@mantine/core'
import { PortableTextReactComponents } from '@portabletext/react'

import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { BlockContentImage } from '~/schemas/models/blockContent'

import { ExternalLink } from './ExternalLink'
import { InternalLink } from './InternalLink'

export interface InEditorProps {
  inEditor?: boolean
}

export const getSharedLinkProps = (
  inEditor: boolean | undefined,
): AnchorProps => {
  const anchorProps: AnchorProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement> = {}

  anchorProps.onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (inEditor) {
      e.preventDefault()
    }
  }
  anchorProps.underline = inEditor ? 'always' : 'hover'

  return anchorProps
}

export const PortableTextComponents: Partial<PortableTextReactComponents> = {
  marks: {
    // Link components must stay as regular function and not be arrow functions
    // Otherwise, there will be an exception thrown
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
