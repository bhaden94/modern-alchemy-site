import {
  Button,
  Checkbox,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import React, { useState } from 'react'

import { useErrorDialog } from '~/hooks/useErrorDialog'
import {
  AnnouncementField,
  announcementSchema,
  TAnnouncementSchema,
} from '~/utils/forms/announcementUtils'

interface IAdminAnnouncement {
  documentId: string
  title?: string
  enabled?: boolean
}

const AdminAnnouncement: React.FC<IAdminAnnouncement> = ({
  documentId,
  title = '',
  enabled = false,
}) => {
  const { openErrorDialog } = useErrorDialog()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      [AnnouncementField.Title.id]: title,
      [AnnouncementField.Enabled.id]: enabled,
    },
    validate: zodResolver(announcementSchema),
  })

  const onMantineSubmit = async (data: TAnnouncementSchema) => {
    setIsSubmitting(true)

    const response = await fetch('/api/sanity/layout-content', {
      method: 'PATCH',
      body: JSON.stringify({
        documentId: documentId,
        announcement: { title: data.title, isActive: data.enabled },
      }),
    })

    if (response.ok) {
      form.resetDirty()
    } else {
      openErrorDialog('There was an issue updating the announcement banner.')
      form.reset()
    }

    setIsSubmitting(false)
  }

  return (
    <Stack>
      <Title ta="center" order={2}>
        Announcement Banner
      </Title>
      <form
        onSubmit={form.onSubmit(onMantineSubmit)}
        className="flex flex-col justify-center gap-4"
      >
        <Checkbox
          disabled={isSubmitting}
          label={AnnouncementField.Enabled.label}
          {...form.getInputProps(AnnouncementField.Enabled.id, {
            type: 'checkbox',
          })}
        />
        <TextInput
          disabled={isSubmitting}
          label={AnnouncementField.Title.label}
          {...form.getInputProps(AnnouncementField.Title.id)}
        />
        <Button type="submit" loading={isSubmitting} disabled={!form.isDirty()}>
          Update Banner
        </Button>
      </form>
    </Stack>
  )
}

export default AdminAnnouncement
