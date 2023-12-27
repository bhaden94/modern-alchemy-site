import Welcome from '~/components/Welcome'

interface IHome {
  content?: string
}

export default function Home({ content }: IHome) {
  return (
    <section>
      {content}
      <Welcome />
    </section>
  )
}
