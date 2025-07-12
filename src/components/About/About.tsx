'use client'

import { MailingListFormContent } from '~/schemas/pages/mailingListFormContent'
import { AboutContent } from '~/schemas/pages/rootPageContent'

import MailingList from '../MailingList/MailingList'
import PageContainer from '../PageContainer'
import AboutItem from './AboutItem/AboutItem'

interface IAbout {
  aboutContent?: AboutContent[]
  mailingListFormContent?: MailingListFormContent
}

const About = ({ aboutContent, mailingListFormContent }: IAbout) => {
  return (
    <PageContainer>
      {aboutContent?.map((aboutItem, i) => (
        <AboutItem key={aboutItem.heading} item={aboutItem} index={i} />
      ))}
      <MailingList content={mailingListFormContent} />
    </PageContainer>
  )
}

export default About
