'use client'

import { Button, Card, Group } from '@mantine/core'
import {
  IconDeviceFloppy,
  IconEye,
  IconEyeClosed,
  IconPencil,
  IconUpload,
} from '@tabler/icons-react'

import classes from './AdminBlogEditorActionBar.module.css'

interface IAdminBlogEditorActionBar {
  togglePreview: () => void
  isSaving: boolean
  isPreview: boolean
  isPublished: boolean
}

const AdminBlogEditorActionBar = ({
  togglePreview,
  isSaving,
  isPreview,
  isPublished,
}: IAdminBlogEditorActionBar) => {
  return (
    <Card className={classes.actionBarCard}>
      <Group justify="flex-end" px="1rem" py={0}>
        <Button
          leftSection={isPreview ? <IconEyeClosed /> : <IconEye />}
          onClick={togglePreview}
          disabled={isSaving}
          variant="subtle"
        >
          Toggle Preview
        </Button>
        <Button
          leftSection={<IconDeviceFloppy />}
          type="submit"
          value="save"
          disabled={isSaving}
          variant="subtle"
        >
          Save Changes
        </Button>
        <Button
          leftSection={isPublished ? <IconPencil /> : <IconUpload />}
          type="submit"
          value={isPublished ? 'unpublish' : 'publish'}
          disabled={isSaving}
        >
          {isPublished ? 'Convert to draft' : 'Publish'}
        </Button>
      </Group>
    </Card>
  )
}

export default AdminBlogEditorActionBar
