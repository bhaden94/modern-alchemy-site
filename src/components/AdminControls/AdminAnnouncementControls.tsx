'use client'

import { Box, Group } from '@mantine/core'

import { AnnouncementPageContent } from '~/schemas/pages/announcementPageContent'
import { RootLayoutContent } from '~/schemas/pages/rootLayoutContent'

import AdminAnnouncement from './AdminAnnouncement/AdminAnnouncement'
import AdminTextEditor from './AdminTextEditor/AdminTextEditor'

interface IAdminSiteContentControls {
  announcementPageContent: AnnouncementPageContent
  rootLayoutContent: RootLayoutContent
}

const AdminAnnouncementControls = ({
  announcementPageContent,
  rootLayoutContent,
}: IAdminSiteContentControls) => {
  return (
    <Group justify="space-around" align="start" gap="xl">
      <Box w={{ base: '100%', sm: 300 }}>
        <AdminAnnouncement
          documentId={rootLayoutContent._id}
          title={rootLayoutContent.announcement?.title}
          enabled={rootLayoutContent.announcement?.isActive}
        />
      </Box>
      <Box w={{ base: '100%', sm: 900 }}>
        <AdminTextEditor
          title="Announcement Page Content"
          initialValue={announcementPageContent.information}
          fieldName="information"
          documentId={announcementPageContent._id}
        />
      </Box>
    </Group>
  )
}

export default AdminAnnouncementControls
