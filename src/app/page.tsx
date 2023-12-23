import PageContainer from '~/components/Container'
import Hero from '~/components/Hero/Hero'

import Home from '../components/Home'

export default async function RootPage() {
  return (
    <>
      <Hero />
      <PageContainer>
        <Home />
      </PageContainer>
    </>
  )
}
