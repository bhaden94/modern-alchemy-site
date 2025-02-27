import { Anchor, AnchorProps } from '@mantine/core'
import { PortableTextMarkComponentProps } from '@portabletext/react'
import Link from 'next/link'

import { InEditorProps } from './PortableTextComponents'

export type ExternalLinkMark = {
  _type: 'link'
  _key: string
  href: string
  blank?: boolean
}

export const ExternalLink: React.FC<
  PortableTextMarkComponentProps<ExternalLinkMark> & InEditorProps
> = ({ value, inEditor, children }) => {
  const { blank, href } = value || { blank: false, href: '' }

  // console.log(value)

  const anchorProps: AnchorProps & {
    component?: any
  } = {}

  anchorProps.underline = inEditor ? 'always' : 'hover'
  anchorProps.fw = 'inherit'
  anchorProps.c = 'primary'

  const onLinkClick = (e: any) => {
    if (inEditor) {
      e.preventDefault()
    }
  }

  // Read https://css-tricks.com/use-target_blank/
  return blank ? (
    <Anchor
      component={Link}
      href={inEditor ? '' : href}
      onClick={onLinkClick}
      {...anchorProps}
      target="_blank"
      rel="noopener"
    >
      {children}
    </Anchor>
  ) : (
    <Anchor
      component={Link}
      href={inEditor ? '' : href}
      onClick={onLinkClick}
      {...anchorProps}
    >
      {children}
    </Anchor>
  )
}
