'use client'

import AdminTextEditor from '~/components/AdminControls/AdminTextEditor/AdminTextEditor'
import { BlockContent } from '~/schemas/models/blockContent'
import { useBlogEditorFormContext } from '~/utils/forms/blogEditorFormContext'
import { BlogEditorField } from '~/utils/forms/blogEditorUtils'

interface IBlogEditorTextEditor {
  initialValue?: BlockContent
  documentId: string
}

export default function BlogEditorTextEditor({
  initialValue,
  documentId,
}: IBlogEditorTextEditor) {
  const form = useBlogEditorFormContext()

  const onContentChange: React.Dispatch<
    React.SetStateAction<BlockContent | undefined>
  > = (value) => {
    const resolvedValue =
      typeof value === 'function' ? value(form.getValues().content) : value
    form.setFieldValue(BlogEditorField.Content.id, resolvedValue)
  }

  return (
    <AdminTextEditor
      initialValue={initialValue}
      fieldName="content"
      documentId={documentId}
      hideActions
      setContentCallback={onContentChange}
    />
  )
}
