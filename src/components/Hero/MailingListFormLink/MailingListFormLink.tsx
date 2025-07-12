import { Anchor, Group } from '@mantine/core'
import { IconArrowDown } from '@tabler/icons-react'

import { MailingListFormContent } from '~/schemas/pages/mailingListFormContent'
import { NavigationInternalIds } from '~/utils/navigation'

import classes from './MailingListFormLink.module.css'

interface IMailingListFormLink {
  content?: MailingListFormContent
}

const MailingListFormLink = ({ content }: IMailingListFormLink) => {
  if (!content?.isActive) return null

  return (
    <Anchor
      href={`#${NavigationInternalIds.MailingList}`}
      underline="hover"
      c="white"
      fw="bold"
      className={classes.link}
    >
      <Group gap={1} wrap="nowrap">
        {content.heroTitle || 'Join our mailing list'}
        <IconArrowDown className={classes.arrowIcon} />
      </Group>
    </Anchor>
  )
}

export default MailingListFormLink
