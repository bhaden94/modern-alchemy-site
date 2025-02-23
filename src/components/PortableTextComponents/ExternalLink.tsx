import { Anchor } from '@mantine/core'
import { PortableTextMarkComponentProps } from '@portabletext/react'

import { InEditorProps } from './PortableTextComponents'

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
