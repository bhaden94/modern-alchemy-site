import { NextRequest, NextResponse } from 'next/server'

import { getClient } from '~/lib/sanity/sanity.client'

const token = process.env.SANITY_API_WRITE_TOKEN

// TODO: Check request is coming from authenticated user
export async function PATCH(request: NextRequest) {
  const client = getClient(token)
  const body = await request.json()
  const { booksOpen, booksOpenAt, artistId } = body

  console.log(
    `Patch artist with Id: ${artistId}`,
    `BooksOpen: ${booksOpen}`,
    `BooksOpenAt: ${booksOpenAt}`,
  )

  if (!artistId) {
    return NextResponse.json({ status: 'fields missing from body' })
  }

  const patchOperation = await client
    .patch(artistId)
    .set({ booksOpen: booksOpen, booksOpenAt: booksOpenAt ?? null })
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
