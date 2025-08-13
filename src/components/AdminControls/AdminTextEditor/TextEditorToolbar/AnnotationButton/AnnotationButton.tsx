'use client'

import { Button, Group, Popover, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEditor, useEditorSelector } from '@portabletext/editor'
import * as selectors from '@portabletext/editor/selectors'
import { IconLink, IconLinkMinus } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { PortableTextObject } from 'sanity'

import BaseToolbarButton from '../BaseToolbarButton/BaseToolbarButton'

const annotationIconMap = {
  link: <IconLink size={16} />,
  internalLink: <IconLinkMinus size={16} />,
} as const

const internalLinkValidation = (value: string): string | null => {
  // Must start with 'mailto' or '/'
  // If it starts with http:// or https://, then have a message about using the external link instead
  // It can be empty
  if (
    value.toLowerCase().startsWith('http') ||
    value.toLowerCase().startsWith('www.')
  ) {
    return 'This looks like a link to an external site. You should use the external link instead.'
  }

  const startsWithAllowedCharacters =
    value.toLowerCase().startsWith('mailto:') ||
    // Allows letters and dashes to validate this is a page on the site
    /^[a-z-]+$/.test(value.toLowerCase())

  return startsWithAllowedCharacters
    ? null
    : 'Internal link must start with "mailto:" or be a valid page route on the site such as "artists".'
}

const externalLinkValidation = (value: string): string | null => {
  const startsWithHttp =
    value.toLowerCase().startsWith('http://') ||
    value.toLowerCase().startsWith('https://')

  return !startsWithHttp ? 'Link must start with http:// or https://' : null
}

interface IAnnotationButton {
  annotation: { name: keyof typeof annotationIconMap }
}

const AnnotationButton = ({ annotation }: IAnnotationButton) => {
  const annotationIcon: JSX.Element = annotationIconMap[annotation.name]
  const [opened, setOpened] = useState(false)
  const editor = useEditor()
  const placeholder =
    annotation.name === 'link'
      ? 'Ex: https://www.modernalchemytattoo.com'
      : 'Ex: artists or mailto:modernalchemytattoo@gmail.com'
  const description =
    annotation.name === 'link'
      ? 'External link should be a valid URL starting with either http:// or https://'
      : 'Internal link must start with "mailto:" or be a valid page route on the site such as "artists".'

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      link: '',
    },
    validate: {
      link: (value: string) => {
        if (!value) return

        if (annotation.name === 'internalLink')
          return internalLinkValidation(value)

        return externalLinkValidation(value)
      },
    },
  })

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
    if (annotationValues.length === 0) {
      form.setFieldValue('link', '')
      return
    }

    annotationValues.forEach((annotationValue: PortableTextObject) => {
      if (annotationValue._type === 'link') {
        form.setFieldValue('link', annotationValue.href as string)
      } else if (annotationValue._type === 'internalLink') {
        form.setFieldValue('link', annotationValue.page as string)
      }
    })
    // Adding form to the dependency array causes an infinite rendering loop
    // We only care about updating the form when the annotation values change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annotationValues])

  const onMantineSubmit = async (data: { link: string }) => {
    form.resetDirty()

    if (active) {
      editor.send({
        type: 'annotation.remove',
        annotation: {
          name: annotation.name,
        },
      })
    }

    // If text is empty, then we just want to remove the link
    if (data.link === '') {
      setOpened(false)
      return
    }

    const annotationValue =
      annotation.name === 'link'
        ? { href: data.link, blank: true }
        : { page: data.link }
    console.log('submit annotation', annotationValue)

    editor.send({
      type: 'annotation.add',
      annotation: {
        name: annotation.name,
        value: annotationValue,
      },
    })

    setOpened(false)
    editor.send({ type: 'focus' })
  }

  return (
    <Popover trapFocus withArrow opened={opened} onChange={setOpened}>
      <Popover.Target>
        <BaseToolbarButton
          onClick={() => setOpened((o) => !o)}
          isActive={active}
        >
          {annotationIcon}
        </BaseToolbarButton>
      </Popover.Target>
      <Popover.Dropdown p="xs">
        <form onSubmit={form.onSubmit(onMantineSubmit)}>
          <Group justify="center">
            <TextInput
              className="w-full"
              {...form.getInputProps('link')}
              key={form.key('link')}
              placeholder={placeholder}
            />

            <Button type="submit">Save</Button>
          </Group>
        </form>
      </Popover.Dropdown>
    </Popover>
  )
}

export default AnnotationButton
