'use client'

import { Accordion,Container, Title } from '@mantine/core'
import { PortableText } from '@portabletext/react'

import { Faq } from '~/types/SanitySchemaTypes'

import classes from './Faqs.module.css'

interface IFaqs {
  faqs: Faq[]
}

const Faqs = ({ faqs }: IFaqs) => {
  return (
    <Container size="sm" className={classes.wrapper}>
      <Title ta="center" className={classes.title}>
        Frequently Asked Questions
      </Title>

      <Accordion variant="separated">
        {faqs.map((faq) => (
          <Accordion.Item value={faq.question} key={faq.question}>
            <Accordion.Control>{faq.question}</Accordion.Control>
            <Accordion.Panel>
              <PortableText value={faq.answer} />
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  )
}

export default Faqs
