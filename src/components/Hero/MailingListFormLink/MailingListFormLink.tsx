import { Anchor, Group } from '@mantine/core'
import { IconArrowDown } from '@tabler/icons-react'

import { MailingListFormContent } from '~/schemas/pages/mailingListFormContent'
import { NavigationInternalIds } from '~/utils/navigation'

interface IMailingListFormLink {
  content?: MailingListFormContent
}

const MailingListFormLink = ({ content }: IMailingListFormLink) => {
  if (!content?.isActive) return undefined

  return (
    <Anchor
      href={`#${NavigationInternalIds.MailingList}`}
      underline="hover"
      c="white"
      fw="bold"
    >
      <Group gap={1} wrap="nowrap">
        {content.heroTitle || 'Join our mailing list'}
        <IconArrowDown />
      </Group>
    </Anchor>
  )
}
export default MailingListFormLink
