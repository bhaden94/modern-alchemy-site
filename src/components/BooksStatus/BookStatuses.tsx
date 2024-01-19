import { Artist } from '~/schemas/models/artist'

import ArtistBooksStatus from './ArtistBooksStatus'

interface IBookStatuses {
  artists: Artist[]
  showForm?: boolean
}

const BookStatuses = ({ artists, showForm }: IBookStatuses) => {
  return (
    <>
      {artists?.map((artist) => (
        <ArtistBooksStatus
          key={artist._id}
          showForm={showForm}
          booksStatus={{
            booksOpen: artist.booksOpen,
            booksOpenAt: artist.booksOpenAt,
            name: artist.name,
            _id: artist._id,
          }}
        />
      ))}
    </>
  )
}

export default BookStatuses
