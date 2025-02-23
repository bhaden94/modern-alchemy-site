import { Image } from '@mantine/core'
import { PortableTextReactComponents } from '@portabletext/react'

import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { BlockContentImage } from '~/schemas/models/blockContent'

import { ExternalLink } from './ExternalLink'
import { InternalLink } from './InternalLink'

export interface InEditorProps {
  inEditor?: boolean
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
