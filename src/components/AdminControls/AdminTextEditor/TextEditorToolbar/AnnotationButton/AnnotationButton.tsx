'use client'

import { Button, Popover, TextInput } from '@mantine/core'
import { useEditor, useEditorSelector } from '@portabletext/editor'
import * as selectors from '@portabletext/editor/selectors'
import { IconLink } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { PortableTextObject } from 'sanity'

import BaseToolbarButton from '../BaseToolbarButton/BaseToolbarButton'

const annotationIconMap = {
  link: <IconLink size={16} />,
} as const

interface IAnnotationButton {
  annotation: { name: string }
}

const AnnotationButton = ({ annotation }: IAnnotationButton) => {
  // We know the annotation will be in the map, so we can ignore the TS error
  // @ts-ignore
  const annotationIcon: JSX.Element = annotationIconMap[annotation.name]
  const [linkValue, setLinkValue] = useState<string>('')
  const editor = useEditor()

  // Editor selectors
  const active = useEditorSelector(
    editor,
    selectors.isActiveAnnotation(annotation.name),
  )
  const annotationValues = useEditorSelector(
    editor,
    selectors.getActiveAnnotations,
  )

  useEffect(() => {
    if (annotationValues.length === 0) setLinkValue('')

    annotationValues.forEach((annotationValue: PortableTextObject) => {
      if (annotationValue._type === 'link') {
        setLinkValue(annotationValue.href as string)
      }
    })
  }, [annotationValues])

  const onAnnotationSave = () => {
    // if active, remove then re-add
    if (active) {
      editor.send({
        type: 'annotation.remove',
        annotation: {
          name: annotation.name,
        },
      })
    }

    // If text is empty, then we just want to remove the link
    if (linkValue === '') return

    editor.send({
      type: 'annotation.add',
      annotation: {
        name: annotation.name,
        value:
          annotation.name === 'link'
            ? { href: linkValue, blank: true }
            : { page: '' },
      },
    })

    editor.send({ type: 'focus' })
  }

  return (
    <Popover trapFocus withArrow>
      <Popover.Target>
        <BaseToolbarButton isActive={active}>
          {annotationIcon}
        </BaseToolbarButton>
      </Popover.Target>
      <Popover.Dropdown p="xs">
        <Button.Group>
          <Button.GroupSection
            variant="default"
            bg="var(--mantine-color-dark-6)"
            pl="xs"
          >
            <TextInput
              className="w-full"
              value={linkValue}
              onChange={(event) => setLinkValue(event.currentTarget.value)}
              variant="unstyled"
              placeholder="Ex: https://www.modernalchemytattoo.com"
            />
          </Button.GroupSection>
          <Button radius="xs" onClick={onAnnotationSave}>
            Save
          </Button>
        </Button.Group>
      </Popover.Dropdown>
    </Popover>
  )
}

export default AnnotationButton
