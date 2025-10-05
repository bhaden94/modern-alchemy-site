import { Group } from '@mantine/core'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { AdminBlogList } from '~/components/BlogList/BlogList'
import CreateBlogButton from '~/components/CreateBlogButton/CreateBlogButton'
import PageContainer from '~/components/PageContainer'
import PageTitle from '~/components/PageTitle/PageTitle'
import {
  authOptions,
  AuthorizedRoles,
  REDIRECT_URL,
  userIsAuthorizedForRoute,
} from '~/lib/next-auth/auth.utils'
import { getArtistById } from '~/lib/sanity/queries/sanity.artistsQuery'
import { getAllBlogsByArtist } from '~/lib/sanity/queries/sanity.blogsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { NavigationPages } from '~/utils/navigation'

interface PageParams {
  params: {
    id: string
  }
}

const authorizedAccessRoles: AuthorizedRoles[] = ['Owner', 'Resident']

export default async function Page({ params }: PageParams) {
  const client = getClient()
  const artist = await getArtistById(client, decodeURI(params.id))
  const session = await getServerSession(authOptions)

  if (!artist || !userIsAuthorizedForRoute(session, authorizedAccessRoles)) {
    redirect(
      `${NavigationPages.Unauthorized}?${REDIRECT_URL}=${encodeURIComponent(
        NavigationPages.EmployeePortal,
      )}`,
    )
  }

  const blogs = await getAllBlogsByArtist(client, artist._id)

  if (!blogs) {
    return (
      <PageContainer>
        <div>You currently have no blogs.</div>
      </PageContainer>
    )
  }

  // TODO: separate published blogs from ones in draft.
  // Have a tab at the top to switch between published and In-draft blog lists

  return (
    <PageContainer>
      <PageTitle title="My Blogs" />
      <Group mb="xl" justify="center">
        <CreateBlogButton artistId={artist._id} />
      </Group>
      <AdminBlogList blogs={blogs} />
    </PageContainer>
  )
}
