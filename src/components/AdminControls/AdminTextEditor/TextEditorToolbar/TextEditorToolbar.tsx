'use client'

import { Button, Group } from '@mantine/core'

import { CustomSchemaDefinition } from '../AdminTextEditor'
import AnnotationButton from './AnnotationButton/AnnotationButton'
import DecoratorButton from './DecoratorButton/DecoratorButton'
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

  // TODO: images probably need to follow the same pattern as in the TattooForm
  // We save to browser and only upload when the form is submitted.
  //   const imageButton = (
  //     <Button
  //       onClick={() => {
  //         editor.send({
  //           type: 'insert.block object',
  //           blockObject: {
  //             name: 'image',
  //             value: { src: 'https://example.com/image.jpg' },
  //           },
  //           placement: 'auto',
  //         })
  //         editor.send({ type: 'focus' })
  //       }}
  //     >
  //       {schemaDefinition.blockObjects[0].name}
  //     </Button>
  //   )

  return (
    <Group className={classes.toolbar}>
      <Button.Group>{styleButtons}</Button.Group>
      <Button.Group>{decoratorButtons}</Button.Group>
      <Button.Group>{annotationButtons}</Button.Group>
      {/* {imageButton} */}
    </Group>
  )
}

export default TextEditorToolbar
