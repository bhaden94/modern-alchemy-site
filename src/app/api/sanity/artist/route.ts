import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import {
  authOptions,
  logAuthorizedRequest,
  notAuthorizedResponse,
} from '~/lib/next-auth/auth.utils'
import { getClient } from '~/lib/sanity/sanity.client'

const token = process.env.SANITY_API_WRITE_TOKEN

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return notAuthorizedResponse(request)
  logAuthorizedRequest(session, request)

  const client = getClient(token)
  const body = await request.json()
  const { booksOpen, booksOpenAt, artistId } = body

  console.log(
    `Patch artist with Id: ${artistId}`,
    `BooksOpen: ${booksOpen === 'OPEN'}`,
    `BooksOpenAt: ${booksOpenAt}`,
  )

  if (!artistId) {
    return NextResponse.json({ status: 'fields missing from body' })
  }

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
