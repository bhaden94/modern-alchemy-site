'use client'

import { DndContext, DragEndEvent } from '@dnd-kit/core'
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  Paper,
  Stack,
  TextInput,
} from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { IconArrowsTransferUpDown, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'

import { TPersonalInfoSchema } from '../AdminPersonalInformationControls'

interface IAdminSocialLinks {
  form: UseFormReturnType<TPersonalInfoSchema>
  isSubmitting: boolean
}

const AdminSocialLinks = ({ form, isSubmitting }: IAdminSocialLinks) => {
  const [autoFocusKey, setAutoFocusKey] = useState<string | null>(null)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      form.setFieldValue('socials', (s) => {
        const oldIndex = s.findIndex((i) => i.label === active.id)
        const newIndex = s.findIndex((i) => i.label === over.id)

        return arrayMove(s, oldIndex, newIndex)
      })
    }
  }

  const onNewSocialItem = () => {
    const key = randomId()
    form.insertListItem('socials', {
      label: '',
      link: '',
      key: key,
    })
    setAutoFocusKey(key)
  }

  const onDelete = (index: number) => {
    form.removeListItem('socials', index)
  }

  return (
    <Fieldset legend="Social Links" disabled={isSubmitting}>
      <Stack>
        <DndContext
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        >
          <SortableContext items={form.getValues().socials.map((s) => s.label)}>
            {form.getValues().socials.map((social, index) => (
              <SortableItem
                key={social.key}
                id={social.label}
                onDelete={() => onDelete(index)}
              >
                <Stack>
                  <Group gap="xs" w="100%">
                    <TextInput
                      label="Label"
                      placeholder="Instagram"
                      w="100%"
                      autoFocus={autoFocusKey === social.key}
                      key={form.key(`socials.${index}.label`)}
                      {...form.getInputProps(`socials.${index}.label`)}
                    />
                    <TextInput
                      label="Link"
                      placeholder="https://www.instagram.com/profile"
                      w="100%"
                      key={form.key(`socials.${index}.link`)}
                      {...form.getInputProps(`socials.${index}.link`)}
                    />
                  </Group>
                </Stack>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>

        <Group justify="center">
          <Button
            variant="light"
            disabled={isSubmitting}
            onClick={onNewSocialItem}
          >
            + Add social
          </Button>
        </Group>
      </Stack>
    </Fieldset>
  )
}

export default AdminSocialLinks

const SortableItem = ({
  id,
  onDelete,
  children,
}: {
  id: string
  onDelete: () => void
  children: React.ReactNode
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Paper shadow="md" px="md" ref={setNodeRef} style={style}>
      {children}
      <Group wrap="nowrap" m="1rem 0" grow>
        <ActionIcon
          aria-label="Drag"
          style={{
            cursor: 'grab',
          }}
          {...attributes}
          {...listeners}
        >
          <IconArrowsTransferUpDown size={16} />
        </ActionIcon>
        <ActionIcon color="red" aria-label="Delete" onClick={onDelete}>
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
    </Paper>
  )
}
