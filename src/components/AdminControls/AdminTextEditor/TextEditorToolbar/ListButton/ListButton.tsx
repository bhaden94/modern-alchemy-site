import { useEditor, useEditorSelector } from '@portabletext/editor'
import * as selectors from '@portabletext/editor/selectors'
import { IconList, IconListNumbers } from '@tabler/icons-react'

import BaseToolbarButton from '../BaseToolbarButton/BaseToolbarButton'

const listIconMap = {
  bullet: <IconList size={16} />,
  number: <IconListNumbers size={16} />,
} as const

interface IListButton {
  list: { name: keyof typeof listIconMap }
}

const ListButton = ({ list }: IListButton) => {
  const listIcon: JSX.Element = listIconMap[list.name]
  const editor = useEditor()

  const active = useEditorSelector(
    editor,
    selectors.isActiveListItem(list.name),
  )

  const onListItemToggle = () => {
    editor.send({
      type: 'list item.toggle',
      listItem: list.name,
    })
    editor.send({
      type: 'focus',
    })
  }

  return (
    <BaseToolbarButton onClick={onListItemToggle} isActive={active}>
      {listIcon}
    </BaseToolbarButton>
  )
}

export default ListButton
