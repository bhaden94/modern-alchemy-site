import { Anchor } from '@mantine/core'
import { PortableTextMarkComponentProps } from '@portabletext/react'
import Link from 'next/link'

import { getSharedLinkProps, InEditorProps } from './PortableTextComponents'

export type ExternalLinkMark = {
  _type: 'link'
  _key: string
  href: string
  blank?: boolean
}

export function ExternalLink(
  props: PortableTextMarkComponentProps<ExternalLinkMark> & InEditorProps,
) {
  const { value, inEditor = false, children } = props
  const { blank, href } = value || { blank: false, href: '' }

  // Read https://css-tricks.com/use-target_blank/
  return blank ? (
    <Anchor
      component={Link}
      href={inEditor ? '' : href}
      {...getSharedLinkProps(inEditor)}
      target="_blank"
      rel="noopener"
    >
      {children}
    </Anchor>
  ) : (
    <Anchor
      component={Link}
      href={inEditor ? '' : href}
      {...getSharedLinkProps(inEditor)}
    >
      {children}
    </Anchor>
  )
}
