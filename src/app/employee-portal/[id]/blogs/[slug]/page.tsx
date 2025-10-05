import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import AdminBlogEditor from '~/components/AdminControls/AdminBlogEditor/AdminBlogEditor'
import PageContainer from '~/components/PageContainer'
import {
  authOptions,
  AuthorizedRoles,
  REDIRECT_URL,
  userIsAuthorizedForRoute,
} from '~/lib/next-auth/auth.utils'
import { getBlogById } from '~/lib/sanity/queries/sanity.blogsQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { NavigationPages } from '~/utils/navigation'

interface PageParams {
  params: {
    id: string
    slug: string // Will be blog _id here
  }
}

const authorizedAccessRoles: AuthorizedRoles[] = ['Owner', 'Resident']

export default async function Page({ params }: PageParams) {
  const client = getClient()
  const session = await getServerSession(authOptions)

  if (!userIsAuthorizedForRoute(session, authorizedAccessRoles)) {
    redirect(
      `${NavigationPages.Unauthorized}?${REDIRECT_URL}=${encodeURIComponent(
        NavigationPages.EmployeePortal,
      )}`,
    )
  }

  const blog = await getBlogById(client, params.slug)

  if (!blog) {
    return (
      <PageContainer>
        <div>Blog not found.</div>
      </PageContainer>
    )
  }

  return <AdminBlogEditor documentId={blog._id} blog={blog} />
}
