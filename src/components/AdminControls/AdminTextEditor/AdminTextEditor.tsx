'use client'

import {
  Anchor,
  Box,
  Button,
  Group,
  Image,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  TextProps,
  Title,
  TitleOrder,
} from '@mantine/core'
import {
  defineSchema,
  EditorProvider,
  PortableTextEditable,
  RenderAnnotationFunction,
  RenderBlockFunction,
  RenderDecoratorFunction,
  RenderStyleFunction,
} from '@portabletext/editor'
import { BlockAnnotationRenderProps } from '@portabletext/editor'
import { EventListenerPlugin } from '@portabletext/editor/plugins'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import { useState } from 'react'

import {
  ExternalLink,
  ExternalLinkMark,
  InternalLink,
  InternalLinkMark,
  PortableTextComponents,
} from '~/components/PortableTextComponents'
import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { BlockContent, BlockContentImage } from '~/schemas/models/blockContent'
import classes from './AdminTextEditor.module.css'

import TextEditorToolbar from './TextEditorToolbar/TextEditorToolbar'

// https://www.portabletext.org/getting-started
// https://github.com/portabletext/editor/blob/main/examples/basic/src/App.tsx
// TODO:
//    : below DONE, but need to clean up.
// - Extract out the components in PortableTextComponents.tsx to a separate file so we can re-use them in both places.
// - Style the overall editor
// - Add toolbar actions for each thing the sanity editor supports
// -- Headers 1 - 6: DONE
// -- Bold, italic, underline: DONE
// -- bulleted list, numbered list
// -- internal and external links: DONE
// -- images: rendering DONE, uploading/adding is not

// Email larry:
// - I can give the ability to change text only for now. $200 for the initial work and $25 for any additional fields after that.
// - Image handling will come at an additional cost of $200, so things like the announcements page would still need to go through me to update with images.
// - I can give you access to turn on/off the announcement separately if you would like.

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
    { name: 'h4' },
    { name: 'h5' },
    { name: 'h6' },
  ],

  // The types below are left empty for this example.
  // See the rendering guide to learn more about each type.

  // Annotations are more complex marks that can hold data (for example, hyperlinks).
  // Hide internal link for now
  annotations: [{ name: 'link' } /*,{ name: 'internalLink' }*/],
  // Lists apply to entire text blocks as well (for example, bullet, numbered).
  lists: [],
  // Inline objects hold arbitrary data that can be inserted into the text (for example, custom emoji).
  inlineObjects: [],
  // Block objects hold arbitrary data that live side-by-side with text blocks (for example, images, code blocks, and tables).
  blockObjects: [{ name: 'image' }],
})

const renderStyle: RenderStyleFunction = (props) => {
  let order: TitleOrder = 1

  switch (props.schemaType.value) {
    case 'h1':
      order = 1
      break
    case 'h2':
      order = 2
      break
    case 'h3':
      order = 3
      break
    case 'h4':
      order = 4
      break
    case 'h5':
      order = 5
      break
    case 'h6':
      order = 6
      break
  }

  if (props.schemaType.value === 'normal') {
    return <Text span>{props.children}</Text>
  }

  return (
    <Title order={order} mb="1rem">
      {props.children}
    </Title>
  )
}

const renderDecorator: RenderDecoratorFunction = (props) => {
  const decoratorProperties: TextProps = {}
  if (props.value === 'strong') decoratorProperties.fw = 700
  if (props.value === 'em') decoratorProperties.fs = 'italic'
  if (props.value === 'underline') decoratorProperties.td = 'underline'

  return (
    <Text {...decoratorProperties} span>
      {props.children}
    </Text>
  )
}

const renderAnnotation: RenderAnnotationFunction = (
  props: BlockAnnotationRenderProps,
) => {
  const commonProps = {
    text: '',
    markType: props.schemaType.name,
    renderNode: () => undefined,
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
          inEditor={true}
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

const renderBlock: RenderBlockFunction = (props) => {
  if (props.schemaType.name === 'image') {
    const imageVal = props.value as unknown as BlockContentImage
    return (
      <Image
        src={getImageFromRef(imageVal)?.url}
        alt={imageVal.altText}
        radius="var(--mantine-radius-default)"
      />
    )
  }

  return <div style={{ marginBlockEnd: '0.25em' }}>{props.children}</div>
}

interface IAdminTextEditor {
  title: string
  initialValue: BlockContent | undefined
  fieldName: string
  artistId: string
}

const AdminTextEditor = ({
  title,
  initialValue,
  fieldName,
  artistId,
}: IAdminTextEditor) => {
  // Set up the initial state getter and setter.
  const [value, setValue] = useState<BlockContent | undefined>(initialValue)
  const [preview, setPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const onSubmit = async (): Promise<void> => {
    setIsSubmitting(true)

    const response = await fetch('/api/sanity/artist', {
      method: 'PATCH',
      body: JSON.stringify({
        [fieldName]: value,
        artistId: artistId,
      }),
    })

    setIsSubmitting(false)

    if (response.ok) {
      console.log('Success')
    } else {
      console.error('Error')
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
        <EventListenerPlugin
          on={(event) => {
            if (event.type === 'mutation') {
              setValue(event.value)
            }
          }}
        />
        <Stack>
          <Title order={2}>{title}</Title>
          <Box pos="relative">
            <LoadingOverlay visible={isSubmitting} zIndex={150} />
            <Stack>
              <TextEditorToolbar schemaDefinition={schemaDefinition} />
              <PortableTextEditable
                disabled={isSubmitting}
                className={classes.editor}
                renderStyle={renderStyle}
                renderDecorator={renderDecorator}
                renderAnnotation={renderAnnotation}
                renderBlock={renderBlock}
                renderListItem={(props) => <>{props.children}</>}
              />
            </Stack>
          </Box>

          <Group justify="space-between">
            <Button
              onClick={() => setPreview(!preview)}
              disabled={isSubmitting}
            >
              Preview
            </Button>
            <Button onClick={onSubmit} disabled={isSubmitting}>
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

export default AdminTextEditor
