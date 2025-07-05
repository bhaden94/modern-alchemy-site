import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { SanityClient } from 'next-sanity'

import {
  authOptions,
  logAuthorizedRequest,
  notAuthorizedResponse,
} from '~/lib/next-auth/auth.utils'
import { getClient } from '~/lib/sanity/sanity.client'
import { Announcement } from '~/schemas/pages/rootLayoutContent'

const token = process.env.SANITY_API_WRITE_TOKEN

const updateAnnouncementField = async (
  client: SanityClient,
  documentId: string,
  announcement: Announcement,
): Promise<NextResponse> => {
  console.log(
    `Update announcement for document id: ${documentId}`,
    `isActive: ${announcement.isActive}`,
    `title: ${announcement.title}`,
  )

  const patchOperation = await client
    .patch(documentId)
    .set({ announcement: announcement })
    .commit()

  console.log(
    `Update announcement completed for document id: ${documentId}`,
    `isActive: ${announcement.isActive}`,
    `title: ${announcement.title}`,
  )

  return NextResponse.json(
    {
      isActive: patchOperation.isActive,
      title: patchOperation.title,
    },
    { status: 200 },
  )
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return notAuthorizedResponse(request)
  logAuthorizedRequest(session, request)

  const client = getClient(token)
  const body = await request.json()
  const { documentId, announcement } = body

  if (!documentId) {
    return new NextResponse(`Error performing PATCH on layout content.`, {
      status: 400,
      statusText: 'DocumentIdMissing',
    })
  }

  if (announcement) {
    return await updateAnnouncementField(client, documentId, announcement)
  }

  return new NextResponse(`Error performing PATCH on layout content.`, {
    status: 500,
    statusText: 'NoOperationFound',
  })
}
