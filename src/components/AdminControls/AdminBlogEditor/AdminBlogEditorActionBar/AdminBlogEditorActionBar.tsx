'use client'

import { Button, Card, Group } from '@mantine/core'
import {
  IconDeviceFloppy,
  IconEye,
  IconEyeClosed,
  IconUpload,
} from '@tabler/icons-react'

import classes from './AdminBlogEditorActionBar.module.css'

interface IAdminBlogEditorActionBar {
  saveAll: () => Promise<void>
  togglePreview: () => void
  isSaving: boolean
  isPreview: boolean
}

// TODO: action to add
// - preview button (done)
//   - Probably create BlogContent that render the page as it would appear to users
//   - Move blog page.tsx code to the new component
//   - ON preview, we show that component instead of the admin editor
// - publish/unpublish button
// - loading states for buttons only shows on the button clicked

const AdminBlogEditorActionBar = ({
  saveAll,
  togglePreview,
  isSaving,
  isPreview,
}: IAdminBlogEditorActionBar) => {
  return (
    <Card className={classes.actionBarCard}>
      <Group justify="flex-end" px="1rem" py={0}>
        <Button
          leftSection={isPreview ? <IconEyeClosed /> : <IconEye />}
          onClick={togglePreview}
          disabled={isSaving}
          loading={isSaving}
          variant="subtle"
        >
          Toggle Preview
        </Button>
        <Button
          leftSection={<IconDeviceFloppy />}
          onClick={saveAll}
          disabled={isSaving}
          loading={isSaving}
          variant="subtle"
        >
          Save Changes
        </Button>
        <Button
          leftSection={<IconUpload />}
          // onClick={saveAll}
          disabled={isSaving}
          loading={isSaving}
        >
          Publish
        </Button>
      </Group>
    </Card>
  )
}

export default AdminBlogEditorActionBar
