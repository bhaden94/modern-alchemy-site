'use client'

import { PortableText } from '@portabletext/react'

import { AftercareInfoPageContent } from '~/types/SanitySchemaTypes'

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
