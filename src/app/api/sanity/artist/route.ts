import { NextRequest, NextResponse } from 'next/server'

import { getClient } from '~/lib/sanity/sanity.client'

const token = process.env.SANITY_API_WRITE_TOKEN

// TODO: Check request is coming from authenticated user
export async function PATCH(request: NextRequest) {
  const client = getClient(token)
  const body = await request.json()
  const { booksOpen, booksOpenAt, artistId } = body

  if (!artistId) {
    return NextResponse.json({ status: 'fields missing from body' })
  }

  const response = await client
    .patch(artistId)
    .set({ booksOpen: booksOpen, booksOpenAt: booksOpenAt })
    .commit()
    .then((updatedDocument) => {
      return NextResponse.json(updatedDocument)
    })

  return NextResponse.json(response)
}
