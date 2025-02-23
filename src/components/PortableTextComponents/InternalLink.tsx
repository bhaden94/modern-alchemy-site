import { Anchor, AnchorProps } from '@mantine/core'
import { PortableTextMarkComponentProps } from '@portabletext/react'
import Link from 'next/link'

import { InEditorProps } from './PortableTextComponents'

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

  const anchorProps: AnchorProps & {
    component?: any
  } = {}

  anchorProps.component = inEditor ? Text : Link
  anchorProps.underline = inEditor ? 'always' : 'hover'
  anchorProps.c = 'primary'
  // if (!inEditor) {
  //   anchorProps.href = href
  // }

  // TODO: Might need to change functionality here
  // When set to Text component, it still moves the page when clicked
  return (
    <Anchor {...anchorProps} href={inEditor ? undefined : href}>
      {children}
    </Anchor>
  )
}
