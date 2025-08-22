import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  InputDescription,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { IconTrash } from '@tabler/icons-react'
import { useState } from 'react'

import FormErrorAlert from '~/components/FormErrorAlert/FormErrorAlert'
import { Artist } from '~/schemas/models/artist'

import { TPersonalInfoSchema } from '../AdminPersonalInformationControls'

interface IAdminBookingRequestEmails {
  artist: Artist
  form: UseFormReturnType<TPersonalInfoSchema>
  isSubmitting: boolean
}

const AdminBookingRequestEmails = ({
  artist,
  form,
  isSubmitting,
}: IAdminBookingRequestEmails) => {
  const [shouldAutoFocus, setShouldAutoFocus] = useState(false)

  // Allows for auto focus when adding new items, but not on page load
  const onNewEmailItem = () => {
    form.insertListItem('bookingEmails', {
      email: '',
      key: randomId(),
    })
    setShouldAutoFocus(true)
  }

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
        size="lg"
        aria-label="Delete"
        disabled={isSubmitting}
        onClick={() => form.removeListItem('bookingEmails', index)}
      >
        <IconTrash size={16} />
      </ActionIcon>
    </Group>
  ))

  return (
    <Fieldset legend="Booking Request Email Recipients" disabled={isSubmitting}>
      <Stack>
        <InputDescription>
          This field is optional. If you add emails here, ONLY these addresses
          receive booking requests. Leave empty to fall back to the primary
          email ({artist.email}). Max 3 emails.
        </InputDescription>
        {form.getValues().bookingEmails.length === 0 ? (
          <Text size="sm" c="dimmed">
            No additional booking emails added.
          </Text>
        ) : (
          bookingEmailRows
        )}
        {form.errors.bookingEmails && (
          <FormErrorAlert message={form.errors.bookingEmails?.toString()} />
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
              Max of 3 emails. Need more? Contact the developer to discuss
              options.
            </Text>
          )}
        </Group>
      </Stack>
    </Fieldset>
  )
}

export default AdminBookingRequestEmails
