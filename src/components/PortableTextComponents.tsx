import { Image } from '@mantine/core'
import { PortableTextReactComponents } from '@portabletext/react'
import Link from 'next/link'

import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { BlockContentImage } from '~/schemas/models/blockContent'

export const PortableTextComponents: Partial<PortableTextReactComponents> = {
  marks: {
    internalLink: ({ value, children }) => {
      const href = `/${encodeURIComponent(value.page)}`
      return <Link href={href}>{children}</Link>
    },
    link: ({ value, children }) => {
      // Read https://css-tricks.com/use-target_blank/
      const { blank, href } = value
      return blank ? (
        <Link href={href} target="_blank" rel="noopener">
          {children}
        </Link>
      ) : (
        <Link href={href}>{children}</Link>
      )
    },
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
