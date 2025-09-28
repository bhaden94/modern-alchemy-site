'use client'

import { Card, Divider, Group, Text } from '@mantine/core'

import { formatDate } from '~/utils'

interface IAdminBlogInformationBar {
  updatedAt?: string
  publishedAt?: string
}

const AdminBlogInformationBar = ({
  updatedAt,
  publishedAt,
}: IAdminBlogInformationBar) => {
  return (
    <Card>
      <Group justify="flex-end" align="center" px="1rem" py={0}>
        <Text>Last saved: {updatedAt ? formatDate(updatedAt) : 'Never'}</Text>

        <Divider orientation="vertical" size="md" visibleFrom="sm" />

        <Text>
          Published: {publishedAt ? formatDate(publishedAt) : 'In draft'}
        </Text>
      </Group>
    </Card>
  )
}

export default AdminBlogInformationBar
