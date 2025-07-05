'use client'

import {
  ActionIcon,
  Card,
  Group,
  Image,
  LoadingOverlay,
  Menu,
} from '@mantine/core'
import { useEditor } from '@portabletext/editor'
import { IconDots, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'

import { useErrorDialog } from '~/hooks/useErrorDialog'
import { getImageFromRef } from '~/lib/sanity/sanity.image'
import { BlockContentImage } from '~/schemas/models/blockContent'

interface IEditorImage {
  image: BlockContentImage
  documentId: string
  fieldName: string
}

const EditorImage = ({ image, documentId, fieldName }: IEditorImage) => {
  const { openErrorDialog } = useErrorDialog()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const editor = useEditor()

  const deleteImage = async () => {
    setIsSubmitting(true)

    const removeImageRefsRes = await fetch('/api/sanity/block-content', {
      method: 'POST',
      body: JSON.stringify({
        documentId: documentId,
        fieldName: fieldName,
        imageKey: image._key,
      }),
    })

    if (!removeImageRefsRes.ok) {
      openErrorDialog('There was an issue removing the image.')
      setIsSubmitting(false)
      return
    }

    const removeImageRefBody = await removeImageRefsRes.json()
    // If the image can't be deleted, it means we have more references to it
    // in other documents.
    if (removeImageRefBody.canDeleteImage) {
      // Delete image
      // Don't block on failed image deletion.
      await fetch('/api/sanity/images', {
        method: 'DELETE',
        body: JSON.stringify({ imageReferences: [image] }),
      })
    }

    setIsSubmitting(false)

    editor.send({
      type: 'delete.block',
      at: [{ _key: image._key || '' }],
    })

    editor.send({ type: 'focus' })
  }

  return (
    <Card withBorder pos="relative">
      <LoadingOverlay visible={isSubmitting} />
      <Card.Section inheritPadding py="xs">
        <Group justify="flex-end">
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon variant="subtle">
                <IconDots />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconTrash size={14} />}
                color="red"
                onClick={deleteImage}
              >
                Delete image
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>

      <Card.Section>
        <Image
          src={getImageFromRef(image._key)?.url}
          alt={image.altText}
          radius="var(--mantine-radius-default)"
        />
      </Card.Section>
    </Card>
  )
}

export default EditorImage
