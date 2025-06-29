import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { groq, SanityClient } from 'next-sanity'
import { SanityDocument } from 'sanity'

import {
  authOptions,
  logAuthorizedRequest,
  notAuthorizedResponse,
} from '~/lib/next-auth/auth.utils'
import { getClient } from '~/lib/sanity/sanity.client'
import { BlockContent } from '~/schemas/models/blockContent'

const token = process.env.SANITY_API_WRITE_TOKEN

const updateBlockContentField = async (
  client: SanityClient,
  documentId: string,
  fieldName: string,
  value: BlockContent,
): Promise<NextResponse> => {
  console.log(
    `Update block content for document id: ${documentId}`,
    `fieldName: ${fieldName}`,
    `value: ${JSON.stringify(value)}`,
  )

  const patchOperation = await client
    .patch(documentId)
    .set({ [fieldName]: value })
    .commit()

  console.log(
    `Update block content completed for document id: ${documentId}`,
    `${fieldName}: ${JSON.stringify(patchOperation[fieldName])}`,
  )

  return NextResponse.json(
    {
      [fieldName]: patchOperation[fieldName],
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
  const { documentId, fieldName, value } = body

  if (!documentId || !fieldName || !value) {
    return new NextResponse(`Error performing PATCH on blockContent.`, {
      status: 400,
      statusText: 'FieldMissing',
    })
  }

  return await updateBlockContentField(client, documentId, fieldName, value)
}

/*
  Used to filter out image references from a given blockContent field on a document.
*/
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return notAuthorizedResponse(request)
  logAuthorizedRequest(session, request)

  const client = getClient(token)
  const body = await request.json()
  const { documentId, fieldName, imageKey } = body
  let canPerformDownstreamImageDelete = true

  console.log(
    `POST to filter image references from blockContent for document id: ${documentId}`,
    `field: ${fieldName}`,
    `imageKey: ${imageKey}`,
  )

  if (!documentId || !fieldName || !imageKey) {
    return new NextResponse(`Error performing POST on blockContent.`, {
      status: 400,
      statusText: 'FieldMissing',
    })
  }

  // Find all documents that reference the image
  const foundImageReferences: SanityDocument[] = await client.fetch(
    groq`*[references($imageKey)]`,
    { imageKey: imageKey },
  )

  // Return early if there are no references to the image
  if (foundImageReferences.length === 0) {
    return NextResponse.json({ canDeleteImage: true }, { status: 200 })
  }

  // In this case, we should still remove the reference from the blockContent,
  // but stop the image delete operation
  if (foundImageReferences.length > 1) {
    canPerformDownstreamImageDelete = false
  }

  // Filter to just the document we are working with
  const filteredImageRefsToDocument = foundImageReferences.filter(
    (ref) => ref._id === documentId,
  )

  // Get the field we want to target since there could be multiple blockContent fields
  // in a given document
  const blockContentField = filteredImageRefsToDocument[0][
    fieldName
  ] as BlockContent

  // Remove the image reference from the blockContent field
  const filteredBlockContent = blockContentField.filter(
    (block) => block._key.toLocaleLowerCase() !== imageKey.toLocaleLowerCase(),
  )

  // Update the field with the new blockContent that does not contain the image reference
  const updateFieldRes = await updateBlockContentField(
    client,
    documentId,
    fieldName,
    filteredBlockContent,
  )

  if (updateFieldRes.ok) {
    return NextResponse.json(
      { canDeleteImage: canPerformDownstreamImageDelete },
      { status: 200 },
    )
  }

  return new NextResponse(`Error performing POST on blockContent.`, {
    status: 500,
    statusText: 'PostOperationFailure',
  })
}
