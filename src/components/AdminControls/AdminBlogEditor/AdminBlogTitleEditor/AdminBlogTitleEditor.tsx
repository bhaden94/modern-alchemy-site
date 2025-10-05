'use client'

import { TextInput } from '@mantine/core'

import { useBlogEditorFormContext } from '~/utils/forms/blogEditorFormContext'
import { BlogEditorField } from '~/utils/forms/blogEditorUtils'

export default function AdminBlogTitleEditor() {
  const form = useBlogEditorFormContext()

  return (
    <TextInput
      label="Title"
      size="lg"
      w="100%"
      key={form.key(BlogEditorField.Title.id)}
      {...form.getInputProps(BlogEditorField.Title.id)}
    />
  )
}
