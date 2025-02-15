import { redirect } from 'next/navigation'

import AdminFormSettingControls from '~/components/AdminControls/AdminFormSettingControls'
import PageContainer from '~/components/PageContainer'
import PageTitle from '~/components/PageTitle/PageTitle'
import { REDIRECT_URL } from '~/lib/next-auth/auth.utils'
import { getArtistById } from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { NavigationPages } from '~/utils/navigation'

const EmployeePortalFormSettingsPage = async ({
  params,
}: {
  params: { id: string }
}) => {
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
      <PageTitle title={`${artist.name} Form/Books Settings`} />
      <AdminFormSettingControls artist={artist} />
    </PageContainer>
  )
}

export default EmployeePortalFormSettingsPage
