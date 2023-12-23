import PageContainer from '~/components/Container'
import { getArtists } from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'

import ArtistList from './ArtistList'

const ArtistsShowcasePage = async () => {
  const client = getClient(undefined)
  const artists = await getArtists(client)

  return (
    <PageContainer>
      <div>Artists page</div>
      <ArtistList artists={artists} />
    </PageContainer>
  )
}

export default ArtistsShowcasePage
