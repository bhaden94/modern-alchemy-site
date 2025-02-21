'use client'

import { Box, Group } from '@mantine/core'

import { Artist } from '~/schemas/models/artist'

import AdminBooksStatus from './AdminBooksStatus/AdminBooksStatus'
import AdminBudgetOptions from './AdminBudgetOptions/AdminBudgetOptions'
import AdminDayAvailability from './AdminDayAvailability/AdminDayAvailability'
import AdminTextEditor from './AdminTextEditor/AdminTextEditor'

const AdminFormSettingControls = ({ artist }: { artist: Artist }) => {
  return (
    <>
      <Group justify="space-around" align="start" gap="xl">
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

        <Box w={{ base: '100%', sm: 300 }}>
          <AdminDayAvailability
            dayAvailability={artist.availableDays}
            artistId={artist._id}
          />
        </Box>

        <Box w={{ base: '100%', sm: 300 }}>
          <AdminBudgetOptions
            budgetOptions={artist.budgetOptions}
            artistId={artist._id}
          />
        </Box>

        <Box w={{ base: '100%', sm: 900 }}>
          <AdminTextEditor
            title="Booking Instructions"
            initialValue={artist.bookingInstructions}
            fieldName="bookingInstructions"
            artistId={artist._id}
          />
        </Box>

        <Box w={{ base: '100%', sm: 900 }}>
          <AdminTextEditor
            title="Books Closed Message"
            initialValue={artist.booksClosedMessage}
            fieldName="booksClosedMessage"
            artistId={artist._id}
          />
        </Box>
      </Group>
    </>
  )
}

export default AdminFormSettingControls
