'use client'

import { Box, Button, Group, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useState } from 'react'
import { z } from 'zod'

import { useErrorDialog } from '~/hooks/useErrorDialog'
import { useSuccessDialog } from '~/hooks/useSuccessDialog'
import { Artist } from '~/schemas/models/artist'

import AdminBookingRequestEmails from './AdminBookingRequestEmails/AdminBookingRequestEmails'
import AdminSocialLinks from './AdminSocialLinks/AdminSocialLinks'

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
    socials: z.array(
      z.object({
        label: z.string().min(1).max(100),
        link: z.string().url({ message: 'Invalid URL' }),
        key: z.string(),
      }),
    ),
  })
  .strict()

export type TPersonalInfoSchema = z.infer<typeof personalInfoSchema>

interface IAdminPersonalInformationControls {
  artist: Artist
}

const AdminPersonalInformationControls = ({
  artist,
}: IAdminPersonalInformationControls) => {
  const { openErrorDialog } = useErrorDialog()
  const { openSuccessDialog } = useSuccessDialog()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TPersonalInfoSchema>({
    mode: 'uncontrolled',
    initialValues: {
      name: artist.name,
      bookingEmails:
        artist.bookingEmails?.map((e) => ({ email: e, key: randomId() })) || [],
      socials:
        artist.socials?.map((s) => ({
          label: s.label,
          link: s.link,
          key: randomId(),
        })) || [],
    },
    validate: zodResolver(personalInfoSchema),
  })

  const onSubmit = async (data: TPersonalInfoSchema) => {
    setIsSubmitting(true)
    const trimmedName = data.name.trim()
    const bookingEmailsArray = data.bookingEmails
      .map((i) => i.email.trim().toLowerCase())
      .filter((e) => e.length > 0)
    const socialsArray = data.socials.map((s) => ({
      label: s.label.trim(),
      link: s.link.trim(),
    }))

    try {
      const response = await fetch('/api/sanity/artist', {
        method: 'PATCH',
        body: JSON.stringify({
          artistId: artist._id,
          personalInformation: {
            name: trimmedName,
            bookingEmails: bookingEmailsArray,
            socials: socialsArray,
          },
        }),
      })

      if (response.ok) {
        form.resetDirty()
        openSuccessDialog('Information updated successfully.')
      } else {
        openErrorDialog('There was an issue updating the information.')
      }
    } catch (error) {
      openErrorDialog(
        'There was an error updating the information. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
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

            <AdminBookingRequestEmails
              artist={artist}
              form={form}
              isSubmitting={isSubmitting}
            />

            <AdminSocialLinks form={form} isSubmitting={isSubmitting} />

            <Button
              type="submit"
              size="lg"
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
