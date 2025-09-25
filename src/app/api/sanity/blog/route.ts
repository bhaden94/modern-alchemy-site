import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { SanityClient, SanityReference } from 'next-sanity'

import {
  authOptions,
  logAuthorizedRequest,
  notAuthorizedResponse,
} from '~/lib/next-auth/auth.utils'
import { getClient } from '~/lib/sanity/sanity.client'
import { Artist } from '~/schemas/models/artist'
import { Blog } from '~/schemas/models/blog'

const token = process.env.SANITY_API_WRITE_TOKEN

const updateField = async (
  client: SanityClient,
  documentId: string,
  fieldName: string,
  value: unknown,
): Promise<NextResponse> => {
  console.log(
    `Update field for document id: ${documentId}`,
    `fieldName: ${fieldName}`,
    `value: ${JSON.stringify(value)}`,
  )

  const patchOperation = await client
    .patch(documentId)
    .set({ [fieldName]: value, updatedAt: new Date().toISOString() })
    .commit()

  console.log(
    `Update field completed for document id: ${documentId}`,
    `${fieldName}: ${JSON.stringify(patchOperation[fieldName])}`,
  )

  return NextResponse.json(
    {
      [fieldName]: patchOperation[fieldName],
    },
    { status: 200 },
  )
}

const updateFields = async (
  client: SanityClient,
  documentId: string,
  updates: Record<string, unknown>,
): Promise<NextResponse> => {
  console.log(
    `Update fields for document id: ${documentId}`,
    `updates: ${JSON.stringify(updates)}`,
  )

  // Get blog post and use current coverImage as an image that can be deleted
  const blogPost = await client.getDocument<Blog>(documentId)
  const imageKeyToDelete = blogPost?.coverImage?._key

  const patchOperation: Blog & { artist: SanityReference } = await client
    .patch(documentId)
    .set({ ...updates, updatedAt: new Date().toISOString() })
    .commit()

  const artist = (await client.getDocument<Artist>(
    patchOperation.artist._ref,
  )) as Artist

  const patchedBlogWithArtist: Blog = { ...patchOperation, artist: artist }

  console.log(
    `Update fields completed for document id: ${documentId}`,
    `updates: ${JSON.stringify(patchedBlogWithArtist)}`,
  )

  return NextResponse.json(
    {
      ...patchedBlogWithArtist,
      imageKeyToDelete: imageKeyToDelete,
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
  const { documentId, fieldName, value, updates } = body

  if (!documentId) {
    return new NextResponse(`Error performing PATCH on blog.`, {
      status: 400,
      statusText: 'DocumentIdMissing',
    })
  }

  if (updates && typeof updates === 'object') {
    return await updateFields(
      client,
      documentId,
      updates as Record<string, unknown>,
    )
  }

  if (fieldName && typeof value !== 'undefined') {
    return await updateField(client, documentId, fieldName, value)
  }

  return new NextResponse(`Error performing PATCH on blog.`, {
    status: 400,
    statusText: 'FieldMissing',
  })
}
