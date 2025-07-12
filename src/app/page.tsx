import { notFound } from 'next/navigation'

import About from '~/components/About/About'
import Hero from '~/components/Hero/Hero'
import { performPageContentQuery } from '~/lib/sanity/queries/sanity.pageContentQueries'

export default async function RootPage() {
  const content = await performPageContentQuery('rootPageContent')

  if (!content) return notFound()

  return (
    <>
      <Hero
        title={content.pageTitle}
        description={content.heroDescription}
        buttonText={content.heroButtonText}
        buttonLink={content.heroButtonLink}
      />
      <About
        aboutContent={content.aboutContent}
        mailingListFormContent={content.mailingListFormContent}
      />
    </>
  )
}
