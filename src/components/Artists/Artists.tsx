import ArtistList from '~/components/Artists/ArtistList'
import { Artist, ArtistsPageContent } from '~/types/SanitySchemaTypes'

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
