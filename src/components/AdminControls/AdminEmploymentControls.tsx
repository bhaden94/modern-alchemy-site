'use client'

import { Box, Group } from '@mantine/core'

import { EmploymentPageContent } from '~/schemas/pages/employmentPageContent'

import AdminTextEditor from './AdminTextEditor/AdminTextEditor'

interface IAdminEmploymentPageControls {
  employmentPageContent: EmploymentPageContent
}

const AdminEmploymentControls = ({
  employmentPageContent,
}: IAdminEmploymentPageControls) => {
  return (
    <Group justify="space-around" align="start" gap="xl">
      <Box w={{ base: '100%', sm: 900 }}>
        <AdminTextEditor
          title="Employment Page Content"
          initialValue={employmentPageContent.information}
          fieldName="information"
          documentId={employmentPageContent._id}
        />
      </Box>
    </Group>
  )
}

export default AdminEmploymentControls
