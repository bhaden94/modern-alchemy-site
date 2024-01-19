'use client'

import { PortableText } from '@portabletext/react'

import { AftercareInfoPageContent } from '~/schemas/pages/aftercareInfoPageContent'

import PageTitle from '../PageTitle/PageTitle'
import { PortableTextComponents } from '../PortableTextComponents'

const AftercareInfo = (content: AftercareInfoPageContent) => {
  return (
    <>
      <PageTitle title={content.pageTitle} />
      <PortableText
        value={content.information}
        components={PortableTextComponents}
      />
    </>
  )
}

export default AftercareInfo
