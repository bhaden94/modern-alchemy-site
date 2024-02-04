'use client'

import { Accordion, Button, Group, Radio } from '@mantine/core'
import { DateTimePicker, DateValue } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useState } from 'react'

import { BooksStatus } from '~/lib/sanity/queries/sanity.artistsQuery'
import {
  BooksStatusField,
  booksStatusSchema,
  TBooksStatusSchema,
} from '~/utils/booksStatusUtils'

interface IAdminBooksStatus {
  booksStatus: BooksStatus
}

const AdminBooksStatus = ({ booksStatus }: IAdminBooksStatus) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [booksOpen, setBooksOpen] = useState<boolean>(booksStatus.booksOpen)

  const form = useForm<TBooksStatusSchema>({
    initialValues: {
      [BooksStatusField.BooksOpen.id]: booksStatus.booksOpen,
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
      console.error('There was an error')
    }

    setIsSubmitting(false)
  }

  const onBooksOpenChange = (value: string) => {
    const booksOpen = value === 'open'
    form.setValues({ [BooksStatusField.BooksOpen.id]: booksOpen })
    setBooksOpen(booksOpen)
  }

  const onBooksOpenAtChange = (date: DateValue) => {
    form.setValues({ [BooksStatusField.BooksOpenAt.id]: date || undefined })
  }

  return (
    <Accordion variant="separated">
      <Accordion.Item value="books-status-form">
        <Accordion.Control>Update Books Status</Accordion.Control>
        <Accordion.Panel>
          <form
            onSubmit={form.onSubmit(onMantineSubmit)}
            className="flex flex-col justify-center gap-4"
          >
            <Radio.Group
              value={booksOpen ? 'open' : 'closed'}
              onChange={onBooksOpenChange}
              id={BooksStatusField.BooksOpen.id}
              label={BooksStatusField.BooksOpen.label}
              error={form.errors[BooksStatusField.BooksOpen.id]}
            >
              <Group mt="xs">
                <Radio value="open" label="Open" />
                <Radio value="closed" label="Closed" />
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
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}

export default AdminBooksStatus
