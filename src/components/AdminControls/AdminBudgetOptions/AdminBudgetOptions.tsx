'use client'

import {
  ActionIcon,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { randomId, useDisclosure } from '@mantine/hooks'
import { IconTrash } from '@tabler/icons-react'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useState } from 'react'

import ErrorDialog from '~/components/ErrorDialog/ErrorDialog'
import {
  BudgetOptionsField,
  budgetOptionsSchema,
  TBudgetOptionsSchema,
} from '~/utils/forms/budgetOptionsUtils'

interface IAdminBudgetOptions {
  budgetOptions: string[] | undefined
  artistId: string
}

const AdminBudgetOptions = ({
  budgetOptions,
  artistId,
}: IAdminBudgetOptions) => {
  const [opened, { open, close }] = useDisclosure(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useForm<TBudgetOptionsSchema>({
    mode: 'uncontrolled',
    initialValues: {
      [BudgetOptionsField.BudgetOptions.id]:
        budgetOptions?.map((item) => ({
          name: item,
          key: randomId(),
        })) || [],
    },
    validate: zodResolver(budgetOptionsSchema),
  })

  const budgetOptionRows = form.getValues().budgetOptions.map((item, index) => (
    <Group key={item.key} mt="xs">
      <TextInput
        placeholder={BudgetOptionsField.BudgetOptions.placeholder}
        disabled={isSubmitting}
        style={{ flex: 1 }}
        key={form.key(`${BudgetOptionsField.BudgetOptions.id}.${index}.name`)}
        {...form.getInputProps(
          `${BudgetOptionsField.BudgetOptions.id}.${index}.name`,
        )}
      />
      <ActionIcon
        disabled={isSubmitting}
        color="red"
        onClick={() =>
          form.removeListItem(BudgetOptionsField.BudgetOptions.id, index)
        }
      >
        <IconTrash size={16} />
      </ActionIcon>
    </Group>
  ))

  const onMantineSubmit = async (data: TBudgetOptionsSchema) => {
    setIsSubmitting(true)

    // We should just send the string array to the server
    const dataToSubmit = data.budgetOptions.map((item) => item.name.trim())

    const response = await fetch('/api/sanity/artist', {
      method: 'PATCH',
      body: JSON.stringify({
        budgetOptions: dataToSubmit,
        artistId: artistId,
      }),
    })

    if (response.ok) {
      form.resetDirty()
    } else {
      open()
    }

    setIsSubmitting(false)
  }

  return (
    <Stack>
      <Title ta="center" order={2}>
        Budget/Session Length Options
      </Title>

      <form
        onSubmit={form.onSubmit(onMantineSubmit)}
        className="flex flex-col justify-center gap-4"
      >
        {budgetOptionRows.length === 0 ? (
          <Text c="dimmed" size="lg" ta="center">
            No options added.
          </Text>
        ) : (
          budgetOptionRows
        )}
        <Group justify="center" mt="md">
          <Button
            disabled={isSubmitting}
            onClick={() =>
              form.insertListItem(BudgetOptionsField.BudgetOptions.id, {
                name: '',
                key: randomId(),
              })
            }
          >
            + Add option
          </Button>
        </Group>

        <Button
          variant="filled"
          type="submit"
          loading={isSubmitting}
          disabled={!form.isDirty()}
        >
          Update Options
        </Button>
      </form>

      <ErrorDialog
        opened={opened}
        onClose={close}
        message="There was an issue updating budget options."
      />
    </Stack>
  )
}

export default AdminBudgetOptions
