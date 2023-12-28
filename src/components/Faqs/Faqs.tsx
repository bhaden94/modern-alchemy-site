'use client'

import { Accordion, Container, Title } from '@mantine/core'
import { PortableText } from '@portabletext/react'

import { FaqPageContent } from '~/types/SanitySchemaTypes'

import { PortableTextComponents } from '../PortableTextComponents'
import classes from './Faqs.module.css'

const Faqs = (content: FaqPageContent) => {
  return (
    <Container size="sm" className={classes.wrapper}>
      <Title ta="center" className={classes.title}>
        {content.pageTitle}
      </Title>

      <Accordion variant="separated">
        {content.faqs.map((faq) => (
          <Accordion.Item value={faq.question} key={faq.question}>
            <Accordion.Control>{faq.question}</Accordion.Control>
            <Accordion.Panel>
              <PortableText
                value={faq.answer}
                components={PortableTextComponents}
              />
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  )
}

export default Faqs
