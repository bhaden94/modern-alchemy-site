import { Anchor } from '@mantine/core'
import { PortableTextMarkComponentProps } from '@portabletext/react'
import Link from 'next/link'

import { getSharedLinkProps, InEditorProps } from './PortableTextComponents'

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

  return (
    <Anchor
      component={Link}
      href={inEditor ? '' : href}
      {...getSharedLinkProps(inEditor)}
    >
      {children}
    </Anchor>
  )
}
