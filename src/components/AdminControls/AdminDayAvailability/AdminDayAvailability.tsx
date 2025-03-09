'use client'

import { Button, Checkbox, Group, Stack, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useState } from 'react'

import { useErrorDialog } from '~/hooks/useErrorDialog'
import { bookingDayChoices } from '~/utils/forms/bookingFormUtils'
import {
  DayAvailabilityField,
  dayAvailabilitySchema,
  TDayAvailabilitySchema,
} from '~/utils/forms/dayAvailabilityUtils'

interface IAdminDayAvailability {
  dayAvailability: string[] | undefined
  artistId: string
}

const AdminDayAvailability = ({
  dayAvailability,
  artistId,
}: IAdminDayAvailability) => {
  const { openErrorDialog } = useErrorDialog()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useForm<TDayAvailabilitySchema>({
    initialValues: {
      [DayAvailabilityField.DayAvailability.id]: dayAvailability || [],
    },
    validate: zodResolver(dayAvailabilitySchema),
  })

  const onMantineSubmit = async (data: TDayAvailabilitySchema) => {
    setIsSubmitting(true)

    const response = await fetch('/api/sanity/artist', {
      method: 'PATCH',
      body: JSON.stringify({
        availableDays: data.dayAvailability,
        artistId: artistId,
      }),
    })

    if (response.ok) {
      form.resetDirty()
    } else {
      openErrorDialog('There was an issue updating your days available.')
      form.reset()
    }

    setIsSubmitting(false)
  }

  return (
    <Stack>
      <Title ta="center" order={2}>
        Day Availability
      </Title>

      <form
        onSubmit={form.onSubmit(onMantineSubmit)}
        className="flex flex-col justify-center gap-4"
      >
        <Checkbox.Group
          {...form.getInputProps(DayAvailabilityField.DayAvailability.id)}
          id={DayAvailabilityField.DayAvailability.id}
          error={form.errors[DayAvailabilityField.DayAvailability.id]}
        >
          <Group my="xs">
            {bookingDayChoices.map((option) => (
              <Checkbox
                disabled={isSubmitting}
                key={option.value}
                value={option.value}
                label={option.label}
                error={!!form.errors[DayAvailabilityField.DayAvailability.id]}
              />
            ))}
          </Group>
        </Checkbox.Group>
        <Button
          variant="filled"
          type="submit"
          loading={isSubmitting}
          disabled={!form.isDirty()}
        >
          Update Availability
        </Button>
      </form>
    </Stack>
  )
}

export default AdminDayAvailability
