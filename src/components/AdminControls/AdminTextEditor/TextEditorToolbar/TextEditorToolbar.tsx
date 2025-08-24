'use client'

import { Button, Group } from '@mantine/core'

import { CustomSchemaDefinition } from '../AdminTextEditor'
import AnnotationButton from './AnnotationButton/AnnotationButton'
import DecoratorButton from './DecoratorButton/DecoratorButton'
import ImageButton from './ImageButton/ImageButton'
import ListButton from './ListButton/ListButton'
import StyleButton from './StyleButton/StyleButton'
import classes from './TextEditorToolbar.module.css'

interface ITextEditorToolbar {
  schemaDefinition: CustomSchemaDefinition
}

const TextEditorToolbar = ({ schemaDefinition }: ITextEditorToolbar) => {
  // Iterate over the schema (defined earlier), or manually create buttons.
  const styleButtons = schemaDefinition.styles?.map((style) => (
    <StyleButton key={style.name} style={style} />
  ))

  const decoratorButtons = schemaDefinition.decorators?.map((decorator) => (
    <DecoratorButton key={decorator.name} decorator={decorator} />
  ))

  const annotationButtons = schemaDefinition.annotations?.map((annotation) => (
    <AnnotationButton key={annotation.name} annotation={annotation} />
  ))

  const listButtons = schemaDefinition.lists?.map((list) => (
    <ListButton key={list.name} list={list} />
  ))

  const imageButtons = schemaDefinition.blockObjects?.map((blockObject) => (
    <ImageButton key={blockObject.name} image={blockObject} />
  ))

  return (
    <Group className={classes.toolbar}>
      <Button.Group>{styleButtons}</Button.Group>
      <Button.Group>{decoratorButtons}</Button.Group>
      <Button.Group>{listButtons}</Button.Group>
      <Button.Group>{annotationButtons}</Button.Group>
      <Button.Group>{imageButtons}</Button.Group>
    </Group>
  )
}

export default TextEditorToolbar
