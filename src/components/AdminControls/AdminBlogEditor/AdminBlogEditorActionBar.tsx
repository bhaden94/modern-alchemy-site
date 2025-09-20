'use client'

import { Button, Card, Group } from '@mantine/core'

interface IAdminBlogEditorActionBar {
  saveAll: () => Promise<void>
  isSaving: boolean
}

// TODO: action to add
// - preview button
//   - Probably create BlogContent that render the page as it would appear to users
//   - Move blog page.tsx code to the new component
//   - ON preview, we show that component instead of the admin editor
// - publish/unpublish button

const AdminBlogEditorActionBar = ({
  saveAll,
  isSaving,
}: IAdminBlogEditorActionBar) => {
  return (
    <Card
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 125,
      }}
    >
      <Group justify="flex-end" style={{ padding: '0.5rem 2rem' }}>
        <Button onClick={saveAll} disabled={isSaving} loading={isSaving}>
          Save Changes
        </Button>
      </Group>
    </Card>
  )
}

export default AdminBlogEditorActionBar
