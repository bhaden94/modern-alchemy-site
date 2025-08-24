'use client'

import './listStyles.css'

import {
  Anchor,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextProps,
  Title,
} from '@mantine/core'
import {
  BlockRenderProps,
  defineSchema,
  EditorEmittedEvent,
  EditorProvider,
  PortableTextEditable,
  RenderAnnotationFunction,
  RenderDecoratorFunction,
  RenderListItemFunction,
  RenderStyleFunction,
} from '@portabletext/editor'
import { EventListenerPlugin } from '@portabletext/editor/plugins'
import { PortableText } from '@portabletext/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'

import {
  ExternalLink,
  ExternalLinkMark,
} from '~/components/PortableTextComponents/ExternalLink'
import {
  InternalLink,
  InternalLinkMark,
} from '~/components/PortableTextComponents/InternalLink'
import { PortableTextComponents } from '~/components/PortableTextComponents/PortableTextComponents'
import { useErrorDialog } from '~/hooks/useErrorDialog'
import { normalizeImageReference } from '~/lib/sanity/sanity.image'
import { BlockContent } from '~/schemas/models/blockContent'

import classes from './AdminTextEditor.module.css'
import EditorImage from './TextEditorToolbar/EditorImage/EditorImage'
import TextEditorToolbar from './TextEditorToolbar/TextEditorToolbar'

export type CustomSchemaDefinition = typeof schemaDefinition
const schemaDefinition = defineSchema({
  // Decorators are simple marks that don't hold any data
  decorators: [{ name: 'strong' }, { name: 'em' }, { name: 'underline' }],
  // Styles apply to entire text blocks
  // There's always a 'normal' style that can be considered the paragraph style
  styles: [
    { name: 'normal' },
    { name: 'h1' },
    { name: 'h2' },
    { name: 'h3' },
    // { name: 'h4' },
    // { name: 'h5' },
    // { name: 'h6' },
  ],

  // Annotations are more complex marks that can hold data (for example, hyperlinks).
  annotations: [
    {
      name: 'link',
      fields: [
        { name: 'href', type: 'string' },
        { name: 'blank', type: 'boolean' },
      ],
    },
    { name: 'internalLink', fields: [{ name: 'page', type: 'string' }] },
  ],
  // Lists apply to entire text blocks as well (for example, bullet, numbered).
  lists: [{ name: 'bullet' }, { name: 'number' }],
  // Inline objects hold arbitrary data that can be inserted into the text (for example, custom emoji).
  inlineObjects: [],
  // Block objects hold arbitrary data that live side-by-side with text blocks (for example, images, code blocks, and tables).
  blockObjects: [
    {
      name: 'image',
      fields: [
        { name: '_key', type: 'string' },
        { name: '_type', type: 'string' },
        {
          name: 'asset',
          type: 'object',
          fields: [
            { name: '_ref', type: 'string' },
            { name: '_type', type: 'reference' },
          ],
        },
      ],
    },
  ],
})

const renderStyle: RenderStyleFunction = (props) => {
  if (props.schemaType.value === 'normal') {
    return <Text span>{props.children}</Text>
  }

  const orderMap = {
    h1: 1,
    h2: 2,
    h3: 3,
    h4: 4,
    h5: 5,
    h6: 6,
  } as const

  const order = orderMap[props.schemaType.value as keyof typeof orderMap]

  return (
    <Title order={order} mb="1rem">
      {props.children}
    </Title>
  )
}

const renderDecorator: RenderDecoratorFunction = (props) => {
  const decoratorProperties: TextProps = {}

  decoratorProperties.fw = props.value === 'strong' ? 'bold' : 'inherit'
  decoratorProperties.fs = props.value === 'em' ? 'italic' : 'inherit'
  decoratorProperties.td = props.value === 'underline' ? 'underline' : 'inherit'

  return (
    <Text {...decoratorProperties} span fz="inherit" c="inherit">
      {props.children}
    </Text>
  )
}

const renderAnnotation: RenderAnnotationFunction = (props) => {
  const commonProps = {
    text: '',
    markType: props.schemaType.name,
    renderNode: () => undefined,
    inEditor: true,
  }

  switch (props.schemaType.name) {
    case 'link':
      return (
        <ExternalLink
          value={props.value as unknown as ExternalLinkMark}
          {...commonProps}
        >
          {props.children}
        </ExternalLink>
      )
    case 'internalLink':
      return (
        <InternalLink
          value={props.value as unknown as InternalLinkMark}
          {...commonProps}
        >
          {props.children}
        </InternalLink>
      )
    default:
      return (
        <Anchor component={Link} href={props.value.href || ''} c="primary">
          {props.children}
        </Anchor>
      )
  }
}

/**
 * Uses custom css located in listStyles.css to render the list items correctly.
 * Hopefully we will get some better support for this in the future
 * https://github.com/portabletext/editor/issues/192
 * @param props - The props for the list item.
 * @returns The rendered list item.
 */
const renderListItem: RenderListItemFunction = (props) => {
  return <>{props.children}</>

  // For some reason using Mantine components here causes some bad lag
  // I am guessing because we are creating a whole new list each time
  // Maybe when the portable text component has a better way to render lists we can use this.
  // return (
  //   <List withPadding type={props.value === 'number' ? 'ordered' : 'unordered'}>
  //     <List.Item>{props.children}</List.Item>
  //   </List>
  // )
}

const renderBlock = (
  props: BlockRenderProps,
  documentId: string,
  fieldName: string,
) => {
  if (props.schemaType.name === 'image') {
    let imageVal = normalizeImageReference(props.value as unknown)

    return imageVal ? (
      <EditorImage
        image={imageVal}
        documentId={documentId}
        fieldName={fieldName}
      />
    ) : (
      <></>
    )
  }

  return <div style={{ marginBlockEnd: '0.25em' }}>{props.children}</div>
}

interface IAdminTextEditor {
  title: string
  initialValue: BlockContent | undefined
  fieldName: string
  documentId: string
}

const AdminTextEditorComponent = ({
  title,
  initialValue,
  fieldName,
  documentId,
}: IAdminTextEditor) => {
  const { openErrorDialog } = useErrorDialog()
  const [value, setValue] = useState<BlockContent | undefined>(initialValue)
  const [preview, setPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [editorLoading, setEditorLoading] = useState<boolean>(false)
  const [hasEdited, setHasEdited] = useState<boolean>(false)

  const showEditorLoading = editorLoading || isSubmitting

  const onEditorEvent = (event: EditorEmittedEvent) => {
    if (event.type === 'mutation') {
      setHasEdited(true)
      setValue(event.value)
    }

    if (event.type === 'read only') {
      setEditorLoading(true)
    }

    if (event.type === 'editable') {
      setEditorLoading(false)
    }
  }

  const onSubmit = async (): Promise<void> => {
    setIsSubmitting(true)

    const response = await fetch('/api/sanity/block-content', {
      method: 'PATCH',
      body: JSON.stringify({
        documentId: documentId,
        fieldName: fieldName,
        value: value,
      }),
    })

    setIsSubmitting(false)

    if (response.ok) {
      setHasEdited(false)
    } else {
      openErrorDialog(`There was an issue updating the ${title}.`)
    }
  }

  return (
    <>
      <EditorProvider
        initialConfig={{
          schemaDefinition,
          initialValue: value,
        }}
      >
        <EventListenerPlugin on={onEditorEvent} />
        <Stack>
          <Title order={2}>{title}</Title>
          <Box pos="relative">
            <LoadingOverlay visible={showEditorLoading} zIndex={150} />
            <Stack gap={0}>
              <TextEditorToolbar schemaDefinition={schemaDefinition} />
              <PortableTextEditable
                disabled={showEditorLoading}
                className={classes.editor}
                renderStyle={renderStyle}
                renderDecorator={renderDecorator}
                renderAnnotation={renderAnnotation}
                renderListItem={renderListItem}
                renderBlock={(props) =>
                  renderBlock(props, documentId, fieldName)
                }
              />
            </Stack>
          </Box>

          <Group justify="space-between">
            <Button
              onClick={() => setPreview(!preview)}
              disabled={showEditorLoading}
            >
              {preview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button
              onClick={onSubmit}
              disabled={showEditorLoading || !hasEdited}
            >
              Save
            </Button>
          </Group>
        </Stack>
      </EditorProvider>

      {value && preview && (
        <PortableText value={value} components={PortableTextComponents} />
      )}
      {/* <pre style={{ border: '1px dashed black', padding: '0.5em' }}>
        {JSON.stringify(value, null, 2)}
      </pre> */}
    </>
  )
}

const AdminTextEditor = dynamic(
  () => Promise.resolve(AdminTextEditorComponent),
  {
    ssr: false,
    loading: () => <LoadingOverlay visible={true} />,
  },
)

export default AdminTextEditor
