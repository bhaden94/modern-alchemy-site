'use client'

import { PortableText } from '@portabletext/react'

import { BlockContent } from '~/schemas/models/blockContent'
import { BasePageContent } from '~/schemas/pages/basePageContent'

import PageTitle from '../PageTitle/PageTitle'
import { PortableTextComponents } from '../PortableTextComponents'

const GeneralPage = (
  content: BasePageContent & { information?: BlockContent },
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
