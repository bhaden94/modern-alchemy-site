import { Artist } from '~/schemas/models/artist'

export function resolveArtistUrl(artist: Artist): string {
  return artist.slug?.current ?? artist._id
}
