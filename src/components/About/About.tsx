'use client'

import { AboutContent } from '~/schemas/pages/rootPageContent'

import PageContainer from '../PageContainer'
import AboutItem from './AboutItem/AboutItem'
import MailingList from '../MailingList/MailingList'

const About = ({ content }: { content?: AboutContent[] }) => {
  if (!content) return undefined

  return (
    <PageContainer>
      {content.map((aboutItem, i) => (
        <AboutItem key={aboutItem.heading} item={aboutItem} index={i} />
      ))}
      <MailingList />
    </PageContainer>
  )
}

export default About
