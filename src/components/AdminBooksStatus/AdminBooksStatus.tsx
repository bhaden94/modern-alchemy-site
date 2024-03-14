'use client'

import {
  Alert,
  Button,
  Dialog,
  Group,
  Radio,
  Stack,
  Title,
} from '@mantine/core'
import { DateTimePicker, DateValue } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useState } from 'react'

import { BooksStatus } from '~/lib/sanity/queries/sanity.artistsQuery'
import {
  BOOKS_OPEN,
  BooksStatusField,
  booksStatusSchema,
  TBooksStatusSchema,
} from '~/utils/forms/booksStatusUtils'

interface IAdminBooksStatus {
  booksStatus: BooksStatus
}

const AdminBooksStatus = ({ booksStatus }: IAdminBooksStatus) => {
  const [opened, { open, close }] = useDisclosure(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useForm<TBooksStatusSchema>({
    initialValues: {
      [BooksStatusField.BooksOpen.id]: booksStatus.booksOpen
        ? 'OPEN'
        : 'CLOSED',
      [BooksStatusField.BooksOpenAt.id]: booksStatus.booksOpenAt
        ? new Date(booksStatus.booksOpenAt)
        : undefined,
    },
    validate: zodResolver(booksStatusSchema),
  })

  const onMantineSubmit = async (data: TBooksStatusSchema) => {
    setIsSubmitting(true)

    const response = await fetch('/api/sanity/artist', {
      method: 'PATCH',
      body: JSON.stringify({
        booksOpen: data.booksOpen,
        booksOpenAt: data.booksOpenAt,
        artistId: booksStatus._id,
      }),
    })

    if (response.ok) {
      form.resetDirty()
    } else {
      open()
    }

    setIsSubmitting(false)
  }

  const onBooksOpenAtChange = (date: DateValue) => {
    form.setValues({ [BooksStatusField.BooksOpenAt.id]: date || undefined })
  }

  return (
    <Stack>
      <Title ta="center" order={2}>
        Update Books Status
      </Title>

      <form
        onSubmit={form.onSubmit(onMantineSubmit)}
        className="flex flex-col justify-center gap-4"
      >
        <Radio.Group
          {...form.getInputProps(BooksStatusField.BooksOpen.id)}
          id={BooksStatusField.BooksOpen.id}
          label={BooksStatusField.BooksOpen.label}
          error={form.errors[BooksStatusField.BooksOpen.id]}
        >
          <Group mt="xs">
            {BOOKS_OPEN.map((option) => (
              <Radio key={option} value={option} label={option} />
            ))}
          </Group>
        </Radio.Group>
        <DateTimePicker
          {...form.getInputProps(BooksStatusField.BooksOpenAt.id)}
          onChange={onBooksOpenAtChange}
          id={BooksStatusField.BooksOpenAt.id}
          label={BooksStatusField.BooksOpenAt.label}
          placeholder={BooksStatusField.BooksOpenAt.placeholder}
          valueFormat="DD MMM YYYY hh:mm A"
          clearable
        />
        <Button
          variant="filled"
          type="submit"
          loading={isSubmitting}
          disabled={!form.isDirty()}
        >
          Update Books
        </Button>
      </form>

      <Dialog opened={opened} onClose={close} p={0}>
        <Alert title="Bummer!" withCloseButton onClose={close}>
          There was an issue updating your books.
        </Alert>
      </Dialog>
    </Stack>
  )
}

export default AdminBooksStatus
