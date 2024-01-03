import ArtistPortfolio from '~/components/ArtistPortfolio/ArtistPortfolio'
import PageContainer from '~/components/PageContainer'
import {
  getArtistByName,
  getArtists,
} from '~/lib/sanity/queries/sanity.artistsQuery'
import { getClient } from '~/lib/sanity/sanity.client'

// export const generateStaticParams = async () => {
//   const client = getClient(undefined)
//   const artists = await getArtists(client)
//   return artists.map((artist) => ({ name: encodeURIComponent(artist.name) }))
// }

const ArtistPortfolioPage = async ({
  params,
}: {
  params: { name: string }
}) => {
  const client = getClient(undefined)
  const artist = await getArtistByName(client, decodeURI(params.name))

  if (!artist) return <div>404</div>

  return (
    <PageContainer>
      <ArtistPortfolio artist={artist} />
    </PageContainer>
  )
}

export default ArtistPortfolioPage
