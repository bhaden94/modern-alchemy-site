import TattooForm from '~/components/TattooForm'

const artists = ['artist1', 'artist2', 'artist3']

export const generateStaticParams = () => {
  return artists.map((artist) => ({ name: artist }))
}

const ArtistPortfolioPage = ({ params }: { params: { name: string } }) => {
  if (!artists.some((artist) => params.name === artist)) return <div>404</div>

  return (
    <>
      <div>Artist: {params.name}</div>
      <TattooForm />
    </>
  )
}

export default ArtistPortfolioPage
