'use client'

import { PortableText } from '@portabletext/react'

import PageTitle from '../PageTitle/PageTitle'
import { PortableTextComponents } from '../PortableTextComponents'
import { BasePageContent } from '~/schemas/pages/basePageContent'
import { TypedObject } from 'sanity'

const GeneralPage = (
  content: BasePageContent & { information?: TypedObject | TypedObject[] },
) => {
  return (
    <>
      <PageTitle title={content.pageTitle} />
      {content.information && (
        <PortableText
          value={content.information}
          components={PortableTextComponents}
        />
      )}
    </>
  )
}

export default GeneralPage
