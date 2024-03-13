import { Box, Group } from '@mantine/core'
import { redirect } from 'next/navigation'

import AdminBooksStatus from '~/components/AdminBooksStatus/AdminBooksStatus'
import AdminHeadshot from '~/components/AdminHeadshot/AdminHeadshot'
import PageContainer from '~/components/PageContainer'
import PageTitle from '~/components/PageTitle/PageTitle'
import { REDIRECT_URL } from '~/lib/next-auth/auth.utils'
import { getArtistById } from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { NavigationPages } from '~/utils/navigation'

const EmployeePortalPage = async ({ params }: { params: { id: string } }) => {
  const client = getClient(undefined)
  const artist = await getArtistById(client, decodeURI(params.id))

  if (!artist) {
    redirect(
      `${NavigationPages.Unauthorized}?${REDIRECT_URL}=${encodeURIComponent(
        NavigationPages.EmployeePortal,
      )}`,
    )
  }

  return (
    <PageContainer>
      <PageTitle title={`${artist.name} Settings`} />
      <Group justify="space-around" align="start" gap="lg">
        <Box>
          <AdminBooksStatus
            booksStatus={{
              booksOpen: artist.booksOpen,
              booksOpenAt: artist.booksOpenAt,
              name: artist.name,
              _id: artist._id,
            }}
          />
        </Box>
        <Box>
          <AdminHeadshot artistId={artist._id} headshotRef={artist.headshot} />
        </Box>
      </Group>
    </PageContainer>
  )
}

export default EmployeePortalPage
