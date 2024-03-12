import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { SanityClient } from 'sanity'

import {
  authOptions,
  logAuthorizedRequest,
  notAuthorizedResponse,
} from '~/lib/next-auth/auth.utils'
import { getClient } from '~/lib/sanity/sanity.client'
import { ImageReference } from '~/utils/images/uploadImagesToSanity'

const token = process.env.SANITY_API_WRITE_TOKEN

const updateBooksStatus = async (
  client: SanityClient,
  artistId: string,
  booksOpen: string,
  booksOpenAt?: Date | null,
): Promise<NextResponse> => {
  console.log(
    `Patch artist with Id: ${artistId}`,
    `BooksOpen: ${booksOpen === 'OPEN'}`,
    `BooksOpenAt: ${booksOpenAt}`,
  )

  const patchOperation = await client
    .patch(artistId)
    .set({ booksOpen: booksOpen === 'OPEN', booksOpenAt: booksOpenAt ?? null })
    .commit()

  console.log(
    `Patch operation completed for ArtistId ${artistId}`,
    `BooksOpen: ${patchOperation.booksOpen}`,
    `BooksOpenAt: ${patchOperation.booksOpenAt}`,
  )

  return NextResponse.json({
    booksOpen: patchOperation.booksOpen,
    booksOpenAt: patchOperation.booksOpenAt,
  })
}

const updateHeadshot = async (
  client: SanityClient,
  artistId: string,
  headshot: ImageReference | 'DELETE',
): Promise<NextResponse> => {
  console.log(
    `Patch artist headshot with Id: ${artistId}`,
    `Headshot: ${headshot}`,
  )

  const patchOperation = await client
    .patch(artistId)
    .set({ headshot: headshot === 'DELETE' ? null : headshot })
    .commit()

  console.log(
    `Patch operation completed for ArtistId ${artistId}`,
    `Headshot: ${patchOperation.headshot}`,
  )

  return NextResponse.json({
    headshot: patchOperation.headshot,
  })
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return notAuthorizedResponse(request)
  logAuthorizedRequest(session, request)

  const client = getClient(token)
  const body = await request.json()
  const { artistId, booksOpen, booksOpenAt, headshot } = body
  if (!artistId) {
    return new NextResponse(`Error performing PATCH on artist.`, {
      status: 400,
      statusText: 'ArtistIdMissing',
    })
  }

  if (booksOpen) {
    return await updateBooksStatus(client, artistId, booksOpen, booksOpenAt)
  }

  if (headshot) {
    return await updateHeadshot(client, artistId, headshot)
  }

  return new NextResponse(
    `Error performing PATCH on artist with id ${artistId}`,
    {
      status: 500,
      statusText: 'NoOperationFound',
    },
  )
}
