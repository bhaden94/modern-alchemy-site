'use client'

import { Button } from '@mantine/core'
import { useEditor, useEditorSelector } from '@portabletext/editor'
import * as selectors from '@portabletext/editor/selectors'
import { IconBold, IconItalic, IconUnderline } from '@tabler/icons-react'

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
    <Button
      onClick={onDecoratorToggle}
      variant={active ? 'filled' : 'light'}
      radius="xs"
      size="compact-xs"
    >
      {decoratorIcon}
    </Button>
  )
}

export default DecoratorButton
