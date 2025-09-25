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
  isSubmitting: boolean
  isPreview: boolean
  isPublished: boolean
}

const AdminBlogEditorActionBar = ({
  togglePreview,
  isSubmitting,
  isPreview,
  isPublished,
}: IAdminBlogEditorActionBar) => {
  return (
    <Card className={classes.actionBarCard}>
      <Group justify="flex-end" px="1rem" py={0}>
        <Button
          leftSection={isPreview ? <IconEyeClosed /> : <IconEye />}
          onClick={togglePreview}
          disabled={isSubmitting}
          variant="subtle"
        >
          Toggle Preview
        </Button>
        <Button
          leftSection={<IconDeviceFloppy />}
          type="submit"
          value="save"
          disabled={isSubmitting}
          variant="subtle"
        >
          Save Changes
        </Button>
        <Button
          leftSection={isPublished ? <IconPencil /> : <IconUpload />}
          type="submit"
          value={isPublished ? 'unpublish' : 'publish'}
          disabled={isSubmitting}
        >
          {isPublished ? 'Convert to draft' : 'Publish'}
        </Button>
      </Group>
    </Card>
  )
}

export default AdminBlogEditorActionBar
