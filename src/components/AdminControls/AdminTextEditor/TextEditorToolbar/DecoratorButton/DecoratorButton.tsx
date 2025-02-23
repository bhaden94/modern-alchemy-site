'use client'

import { useEditor, useEditorSelector } from '@portabletext/editor'
import * as selectors from '@portabletext/editor/selectors'
import { IconBold, IconItalic, IconUnderline } from '@tabler/icons-react'

import BaseToolbarButton from '../BaseToolbarButton/BaseToolbarButton'

const decoratorIconMap = {
  strong: <IconBold size={16} />,
  em: <IconItalic size={16} />,
  underline: <IconUnderline size={16} />,
} as const

interface IDecoratorButton {
  decorator: { name: string }
}

const DecoratorButton = ({ decorator }: IDecoratorButton) => {
  // We know the decorator will be in the map, so we can ignore the TS error
  // @ts-ignore
  const decoratorIcon: JSX.Element = decoratorIconMap[decorator.name]
  const editor = useEditor()

  // Editor selectors
  const active = useEditorSelector(
    editor,
    selectors.isActiveDecorator(decorator.name),
  )

  const onDecoratorToggle = () => {
    editor.send({
      type: 'decorator.toggle',
      decorator: decorator.name,
    })
    editor.send({
      type: 'focus',
    })
  }

  return (
    <BaseToolbarButton onClick={onDecoratorToggle} isActive={active}>
      {decoratorIcon}
    </BaseToolbarButton>
  )
}

export default DecoratorButton
