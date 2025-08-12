import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import AdminAnnouncementControls from '~/components/AdminControls/AdminAnnouncementControls'
import PageContainer from '~/components/PageContainer'
import PageTitle from '~/components/PageTitle/PageTitle'
import {
  authOptions,
  AuthorizedRoles,
  REDIRECT_URL,
  userIsAuthorizedForRoute,
} from '~/lib/next-auth/auth.utils'
import { getArtistById } from '~/lib/sanity/queries/sanity.artistsQuery'
import {
  getRootLayoutContent,
  performPageContentQuery,
} from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'
import { NavigationPages } from '~/utils/navigation'

const authorizedAccessRoles: AuthorizedRoles[] = ['Owner']

const EmployeePortalSiteContentPage = async ({
  params,
}: {
  params: { id: string }
}) => {
  const client = getClient(undefined)
  const artist = await getArtistById(client, decodeURI(params.id))
  const session = await getServerSession(authOptions)
  const rootLayoutContent = await getRootLayoutContent(client)
  const announcementPageContent = await performPageContentQuery(
    'announcementPageContent',
  )

  if (!artist || !userIsAuthorizedForRoute(session, authorizedAccessRoles)) {
    redirect(
      `${NavigationPages.Unauthorized}?${REDIRECT_URL}=${encodeURIComponent(
        NavigationPages.EmployeePortal,
      )}`,
    )
  }

  return (
    <PageContainer>
      <PageTitle title="Site Content" />
      <AdminAnnouncementControls
        announcementPageContent={announcementPageContent}
        rootLayoutContent={rootLayoutContent}
      />
    </PageContainer>
  )
}

export default EmployeePortalSiteContentPage
