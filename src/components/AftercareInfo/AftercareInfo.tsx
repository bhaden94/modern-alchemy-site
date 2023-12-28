'use client'

import { Container, Title } from '@mantine/core'
import { PortableText } from '@portabletext/react'

import { AftercareInfoPageContent } from '~/types/SanitySchemaTypes'

import { PortableTextComponents } from '../PortableTextComponents'
import classes from './AftercareInfo.module.css'

const AftercareInfo = (content: AftercareInfoPageContent) => {
  return (
    <Container size="sm" className={classes.wrapper}>
      <Title ta="center" className={classes.title}>
        {content.pageTitle}
      </Title>

      <PortableText
        value={content.information}
        components={PortableTextComponents}
      />
    </Container>
  )
}

export default AftercareInfo
