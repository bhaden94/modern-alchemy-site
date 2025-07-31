import { notFound } from 'next/navigation'

import About from '~/components/About/About'
import Hero from '~/components/Hero/Hero'
import { getDefaultMailingList } from '~/lib/sanity/queries/sanity.mailingListQuery'
import { performPageContentQuery } from '~/lib/sanity/queries/sanity.pageContentQueries'

export default async function RootPage() {
  const content = await performPageContentQuery('rootPageContent')
  // When we have an artist specific mailing list, we should still get the default here
  const mailingListContent = await getDefaultMailingList()

  if (!content) return notFound()

  return (
    <>
      <Hero
        title={content.pageTitle}
        description={content.heroDescription}
        buttonText={content.heroButtonText}
        buttonLink={content.heroButtonLink}
        mailingListContent={mailingListContent}
      />
      <About
        aboutContent={content.aboutContent}
        mailingListContent={mailingListContent}
      />
    </>
  )
}
