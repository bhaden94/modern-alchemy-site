'use client'

import {
  ActionIcon,
  Box,
  Button,
  Fieldset,
  Group,
  InputDescription,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { IconTrash } from '@tabler/icons-react'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useState } from 'react'
import { z } from 'zod'

import { useErrorDialog } from '~/hooks/useErrorDialog'
import { useSuccessDialog } from '~/hooks/useSuccessDialog'
import { Artist } from '~/schemas/models/artist'

import FormErrorAlert from '../FormErrorAlert/FormErrorAlert'

const personalInfoSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .max(80, 'Name must be 80 characters or less'),
    bookingEmails: z
      .array(
        z.object({
          email: z.string().email({ message: 'Invalid email address' }),
          key: z.string(),
        }),
      )
      .max(3, 'You can only have up to 3 emails')
      .refine(
        (arr) => {
          const emails = arr.map((i) => i.email.trim().toLowerCase())
          return new Set(emails).size === emails.length
        },
        {
          message: 'Duplicate emails are not allowed',
        },
      ),
  })
  .strict()

type TPersonalInfoSchema = z.infer<typeof personalInfoSchema>

interface IAdminPersonalInformationControls {
  artist: Artist
}

const AdminPersonalInformationControls = ({
  artist,
}: IAdminPersonalInformationControls) => {
  const { openErrorDialog } = useErrorDialog()
  const { openSuccessDialog } = useSuccessDialog()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shouldAutoFocus, setShouldAutoFocus] = useState(false)

  const form = useForm<TPersonalInfoSchema>({
    mode: 'uncontrolled',
    initialValues: {
      name: artist.name,
      bookingEmails:
        artist.bookingEmails?.map((e) => ({ email: e, key: randomId() })) || [],
    },
    validate: zodResolver(personalInfoSchema),
  })

  const bookingEmailRows = form.getValues().bookingEmails.map((item, index) => (
    <Group key={item.key} gap="xs">
      <TextInput
        placeholder="mybookings@example.com"
        style={{ flex: 1 }}
        disabled={isSubmitting}
        autoFocus={shouldAutoFocus}
        key={form.key(`bookingEmails.${index}.email`)}
        {...form.getInputProps(`bookingEmails.${index}.email`)}
      />
      <ActionIcon
        color="red"
        disabled={isSubmitting}
        onClick={() => form.removeListItem('bookingEmails', index)}
      >
        <IconTrash size={16} />
      </ActionIcon>
    </Group>
  ))

  // Allows for auto focus when adding new items, but not on page load
  const onNewEmailItem = () => {
    form.insertListItem('bookingEmails', {
      email: '',
      key: randomId(),
    })
    setShouldAutoFocus(true)
  }

  const onSubmit = async (data: TPersonalInfoSchema) => {
    setIsSubmitting(true)
    const trimmedName = data.name.trim()
    const bookingEmailsArray = data.bookingEmails
      .map((i) => i.email.trim().toLowerCase())
      .filter((e) => e.length > 0)

    const response = await fetch('/api/sanity/artist', {
      method: 'PATCH',
      body: JSON.stringify({
        artistId: artist._id,
        personalInformation: {
          name: trimmedName,
          bookingEmails: bookingEmailsArray,
        },
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
      <Box w={{ base: '100%', sm: 400 }}>
        <Stack>
          <Title order={3} ta="center">
            Update Personal Information
          </Title>
          {/* Try an update on this email field later */}
          {/* Will require a force logout I believe */}
          <TextInput
            label="Email"
            value={artist.email}
            description="Email used to login on the employee portal (this page)"
            disabled
          />
          <form
            onSubmit={form.onSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <TextInput
              label="Name"
              placeholder="John Dough"
              required
              disabled={isSubmitting}
              key={form.key('name')}
              {...form.getInputProps('name')}
            />
            <Fieldset
              legend="Booking Request Email Recipients"
              disabled={isSubmitting}
            >
              <Stack>
                <InputDescription>
                  This field is optional. If you add emails here, ONLY these
                  addresses receive booking requests. Leave empty to fall back
                  to the primary email ({artist.email}). Max 3 emails.
                </InputDescription>
                {form.getValues().bookingEmails.length === 0 ? (
                  <Text size="sm" c="dimmed">
                    No additional booking emails added.
                  </Text>
                ) : (
                  bookingEmailRows
                )}
                {form.errors.bookingEmails && (
                  <FormErrorAlert
                    message={form.errors.bookingEmails?.toString()}
                  />
                )}
                <Group justify="center">
                  <Button
                    variant="light"
                    disabled={
                      isSubmitting || form.getValues().bookingEmails.length >= 3
                    }
                    onClick={onNewEmailItem}
                  >
                    + Add email
                  </Button>
                  {form.getValues().bookingEmails.length >= 3 && (
                    <Text size="xs" c="dimmed">
                      Max of 3 emails. Need more? Contact the developer to
                      discuss options.
                    </Text>
                  )}
                </Group>
              </Stack>
            </Fieldset>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!form.isDirty() || isSubmitting}
            >
              Update Information
            </Button>
          </form>
        </Stack>
      </Box>
    </Group>
  )
}

export default AdminPersonalInformationControls
