'use client'

import { useEditor, useEditorSelector } from '@portabletext/editor'
import * as selectors from '@portabletext/editor/selectors'
import {
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconH6,
} from '@tabler/icons-react'

import BaseToolbarButton from '../BaseToolbarButton/BaseToolbarButton'

const styleIconMap = {
  h1: <IconH1 size={16} />,
  h2: <IconH2 size={16} />,
  h3: <IconH3 size={16} />,
  h4: <IconH4 size={16} />,
  h5: <IconH5 size={16} />,
  h6: <IconH6 size={16} />,
} as const

interface IStyleButton {
  style: { name: string }
}

const StyleButton = ({ style }: IStyleButton) => {
  // @ts-ignore
  const styleIcon = styleIconMap[style.name]
  const editor = useEditor()

  // Editor selectors
  const active = useEditorSelector(editor, selectors.isActiveStyle(style.name))

  const onStyleToggle = () => {
    editor.send({
      type: 'style.toggle',
      style: style.name,
    })
    editor.send({
      type: 'focus',
    })
  }

  if (style.name === 'normal') {
    return undefined
  }

  return (
    <BaseToolbarButton onClick={onStyleToggle} isActive={active}>
      {styleIcon}
    </BaseToolbarButton>
  )
}

export default StyleButton
