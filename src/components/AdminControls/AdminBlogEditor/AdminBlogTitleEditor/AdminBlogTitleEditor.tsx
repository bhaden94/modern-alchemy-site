'use client'

import { TextInput } from '@mantine/core'

interface AdminBlogTitleEditorProps {
  title?: string
  onChange: (value: string) => void
}

export default function AdminBlogTitleEditor({
  title,
  onChange,
}: AdminBlogTitleEditorProps) {
  return (
    <TextInput
      label="Title"
      size="lg"
      w="100%"
      value={title}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  )
}
