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

const updateFields = async (
  client: SanityClient,
  documentId: string,
  updates: Partial<Blog>,
): Promise<NextResponse> => {
  console.log(
    `Update fields for document id: ${documentId}`,
    `updates: ${JSON.stringify(updates)}`,
  )

  // Get blog post and use current coverImage as an image that can be deleted
  const blogPost = await client.getDocument<Blog>(documentId)
  const imageKeyToDelete = blogPost?.coverImage?._key

  if (
    (updates.state === 'published' || blogPost?.state === 'published') &&
    (!updates.title || !updates.content || updates.content.length === 0)
  ) {
    return new NextResponse(
      `Cannot publish blog without title and content set.`,
      {
        status: 400,
        statusText: 'MissingRequiredFields',
      },
    )
  }

  const patch = client.patch(documentId)
  patch.set({ ...updates, updatedAt: new Date().toISOString() })

  if (updates.coverImage === null) {
    patch.unset(['coverImage'])
  }

  const patchOperation: Blog & { artist: SanityReference } =
    await patch.commit()

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
  const { documentId, updates } = body

  if (!documentId) {
    return new NextResponse(`Error performing PATCH on blog.`, {
      status: 400,
      statusText: 'DocumentIdMissing',
    })
  }

  return await updateFields(client, documentId, updates as Partial<Blog>)
}
