import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { authOptions, REDIRECT_URL } from '~/lib/next-auth/auth.utils'
import { NavigationPages } from '~/utils/navigation'

import SideNav from '../../../components/SideNav/SideNav'

export const metadata: Metadata = {
  title: 'Employee Portal',
  description: 'Employee admin page.',
  openGraph: {
    title: 'Employee Portal',
    description: 'Employee admin page.',
  },
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect(
      `${NavigationPages.Unauthorized}?${REDIRECT_URL}=${encodeURIComponent(
        NavigationPages.EmployeePortal,
      )}`,
    )
  }

  return (
    <>
      <SideNav session={session} id={params.id} />
      <div>{children}</div>
    </>
  )
}
