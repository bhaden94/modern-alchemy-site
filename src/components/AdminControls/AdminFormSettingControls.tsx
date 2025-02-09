'use client'

import { Box, Group } from '@mantine/core'

import { Artist } from '~/schemas/models/artist'
import AdminBooksStatus from './AdminBooksStatus/AdminBooksStatus'

const AdminFormSettingControls = ({ artist }: { artist: Artist }) => {
  return (
    <>
      <Group justify="space-around" align="start" gap="lg">
        <Box w={{ base: '100%', sm: 300 }}>
          <AdminBooksStatus
            booksStatus={{
              booksOpen: artist.booksOpen,
              booksOpenAt: artist.booksOpenAt,
              name: artist.name,
              _id: artist._id,
            }}
          />
        </Box>
      </Group>
    </>
  )
}

export default AdminFormSettingControls
