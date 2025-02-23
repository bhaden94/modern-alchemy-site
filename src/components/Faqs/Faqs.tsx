'use client'

import { Accordion, Container } from '@mantine/core'
import { PortableText } from '@portabletext/react'

import { FaqPageContent } from '~/schemas/pages/faqPageContent'

import PageTitle from '../PageTitle/PageTitle'
import { PortableTextComponents } from '../PortableTextComponents/PortableTextComponents'

const Faqs = (content: FaqPageContent) => {
  return (
    <Container size="sm" px={0}>
      <PageTitle title={content.pageTitle} />

      <Accordion variant="separated">
        {content.faqs?.map((faq) => (
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
