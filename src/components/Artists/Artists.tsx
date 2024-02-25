import ArtistList from '~/components/Artists/ArtistList/ArtistList'
import { Artist } from '~/schemas/models/artist'
import { ArtistsPageContent } from '~/schemas/pages/artistsPageContent'

import PageTitle from '../PageTitle/PageTitle'

interface IArtists {
  content: ArtistsPageContent
  artists: Artist[]
}

const Artists = ({ content, artists }: IArtists) => {
  return (
    <>
      <PageTitle title={content.pageTitle} />
      <ArtistList artists={artists} />
    </>
  )
}

export default Artists
