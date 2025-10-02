import BlogList from '~/components/BlogList/BlogList'
import PageContainer from '~/components/PageContainer'
import PageTitle from '~/components/PageTitle/PageTitle'
import { getAllBlogsByArtist } from '~/lib/sanity/queries/sanity.blogsQuery'
import { getClient } from '~/lib/sanity/sanity.client'

interface PageParams {
  params: {
    id: string
  }
}

export default async function Page({ params }: PageParams) {
  const client = getClient()
  const blogs = await getAllBlogsByArtist(client, params.id)

  if (!blogs) {
    return (
      <PageContainer>
        <div>You currently have no blogs.</div>
      </PageContainer>
    )
  }

  // TODO: separate published blogs from ones in draft.
  // Have a tab at the top to switch between published and In-draft blog lists

  // TODO: Create blog button
  // Calls create API on blog and sets the minimally required fields: artist ref and state of draft
  // Then redirects to the edit page automatically

  return (
    <PageContainer>
      <PageTitle title="My Blogs" />
      <BlogList blogs={blogs} />
    </PageContainer>
  )
}
