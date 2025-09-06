import { Anchor, Divider, Group, Text } from '@mantine/core'
import Link from 'next/link'
import React from 'react'

export interface IBlogPublishInfo {
  authorName: string
  authorUrl: string
  publishedAt?: string
}

const formatDate = (date?: string): [string, string] => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' } as const
  const parsedDate = date ? new Date(date) : undefined
  return [
    parsedDate ? parsedDate.toLocaleDateString('en-US', options) : '',
    parsedDate ? parsedDate.toISOString() : '',
  ]
}

export const BlogPublishInfo: React.FC<IBlogPublishInfo> = ({
  authorName,
  authorUrl,
  publishedAt,
}) => {
  const [displayDate, isoDate] = formatDate(publishedAt)

  return (
    <Group style={{ color: 'var(--mantine-color-dimmed)' }}>
      <Anchor
        component={Link}
        href={authorUrl}
        underline="always"
        c="inherit"
        target="_blank"
      >
        {authorName}
      </Anchor>
      <Divider
        orientation="vertical"
        size="md"
        color="var(--mantine-color-dimmed)"
      />
      <Text component="time" dateTime={isoDate} c="inherit">
        {displayDate}
      </Text>
    </Group>
  )
}

export default BlogPublishInfo
