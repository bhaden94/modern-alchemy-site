'use client'

import { Button, Group, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'

import { useErrorDialog } from '~/hooks/useErrorDialog'
import { useSuccessDialog } from '~/hooks/useSuccessDialog'
import { Artist } from '~/schemas/models/artist'

interface IAdminPersonalInformationControls {
  artist: Artist
}

const AdminPersonalInformationControls = ({
  artist,
}: IAdminPersonalInformationControls) => {
  const { openErrorDialog } = useErrorDialog()
  const { openSuccessDialog } = useSuccessDialog()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { name: artist.name },
    validate: {
      name: (value: string) => {
        const trimmed = value.trim()
        if (!trimmed) return 'Name is required'
        if (trimmed.length > 80) return 'Name must be 80 characters or less'
        return null
      },
    },
  })

  const onSubmit = async (data: { name: string }) => {
    setIsSubmitting(true)
    const trimmedName = data.name.trim()
    const response = await fetch('/api/sanity/artist', {
      method: 'PATCH',
      body: JSON.stringify({
        artistId: artist._id,
        personalInformation: { name: trimmedName },
      }),
    })

    if (response.ok) {
      form.resetDirty()
      openSuccessDialog('Information updated successfully.')
    } else {
      openErrorDialog('There was an issue updating the information.')
    }
    setIsSubmitting(false)
  }

  return (
    <Group justify="space-around" align="start" gap="xl">
      <Stack>
        <Title order={3} ta="center">
          Update Personal Information
        </Title>
        <form
          onSubmit={form.onSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <TextInput
            label="Name"
            placeholder="John Dough"
            key={form.key('name')}
            {...form.getInputProps('name')}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={!form.isDirty() || isSubmitting}
          >
            Update Information
          </Button>
        </form>
      </Stack>
    </Group>
  )
}

export default AdminPersonalInformationControls
