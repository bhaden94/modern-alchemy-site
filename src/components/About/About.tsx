'use client'

import { MailingListContent } from '~/schemas/models/mailingList'
import { AboutContent } from '~/schemas/pages/rootPageContent'

import MailingList from '../MailingList/MailingList'
import PageContainer from '../PageContainer'
import AboutItem from './AboutItem/AboutItem'

interface IAbout {
  aboutContent?: AboutContent[]
  mailingListContent?: MailingListContent
}

const About = ({ aboutContent, mailingListContent }: IAbout) => {
  return (
    <PageContainer>
      {aboutContent?.map((aboutItem, i) => (
        <AboutItem key={aboutItem.heading} item={aboutItem} index={i} />
      ))}
      <MailingList content={mailingListContent} />
    </PageContainer>
  )
}

export default About
