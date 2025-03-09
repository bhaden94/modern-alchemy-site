import { redirect } from 'next/navigation'

import AdminSiteContentControls from '~/components/AdminControls/AdminSiteContentControls'
import PageContainer from '~/components/PageContainer'
import PageTitle from '~/components/PageTitle/PageTitle'
import { REDIRECT_URL } from '~/lib/next-auth/auth.utils'
import { getArtistById } from '~/lib/sanity/queries/sanity.artistsQuery'
import {
  getRootLayoutContent,
  performPageContentQuery,
} from '~/lib/sanity/queries/sanity.pageContentQueries'
import { getClient } from '~/lib/sanity/sanity.client'
import { NavigationPages } from '~/utils/navigation'

// TODO: If there is ever another artist, we need roles so only the site owner can access this page.
const EmployeePortalSiteContentPage = async ({
  params,
}: {
  params: { id: string }
}) => {
  const client = getClient(undefined)
  const artist = await getArtistById(client, decodeURI(params.id))
  const rootLayoutContent = await getRootLayoutContent(client)
  const announcementPageContent = await performPageContentQuery(
    'announcementPageContent',
  )

  if (!artist) {
    redirect(
      `${NavigationPages.Unauthorized}?${REDIRECT_URL}=${encodeURIComponent(
        NavigationPages.EmployeePortal,
      )}`,
    )
  }

  return (
    <PageContainer>
      <PageTitle title="Site Content" />
      <AdminSiteContentControls
        announcementPageContent={announcementPageContent}
        rootLayoutContent={rootLayoutContent}
      />
    </PageContainer>
  )
}

export default EmployeePortalSiteContentPage
