'use client'

import { Box, Group } from '@mantine/core'

import { AnnouncementPageContent } from '~/schemas/pages/announcementPageContent'

import AdminTextEditor from './AdminTextEditor/AdminTextEditor'

interface IAdminSiteContentControls {
  announcementPageContent: AnnouncementPageContent
}

const AdminSiteContentControls = ({
  announcementPageContent,
}: IAdminSiteContentControls) => {
  return (
    <Group justify="space-around" align="start" gap="xl">
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

export default AdminSiteContentControls
