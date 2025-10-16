import { Group } from '@mantine/core'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import BlogTabs from '~/components/BlogList/BlogTabs'
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

  return (
    <PageContainer>
      <PageTitle title="My Blogs" />
      <Group mb="xl" justify="center">
        <CreateBlogButton artistId={artist._id} />
      </Group>
      <BlogTabs artistId={artist._id} />
    </PageContainer>
  )
}
