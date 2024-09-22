import { SanityDocument } from '@sanity/client'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { groq } from 'next-sanity'
import { SanityClient } from 'sanity'

import {
  authOptions,
  logAuthorizedRequest,
  notAuthorizedResponse,
} from '~/lib/next-auth/auth.utils'
import { getClient, NEXT_TAGS_CONFIG } from '~/lib/sanity/sanity.client'
import { ImageReference } from '~/utils/images/uploadImagesToSanity'

const token = process.env.SANITY_API_WRITE_TOKEN

// Trying to append references that already exists results in an error
// This filters the images down to ones that are unique
const filterDuplicatePortfolioImages = async (
  client: SanityClient,
  artistId: string,
  portfolioImages: ImageReference[],
): Promise<ImageReference[]> => {
  const currentPortfolioImages: ImageReference[] = await client.fetch(
    groq`*[_id == $artistId][0].portfolioImages`,
    { artistId: artistId },
    NEXT_TAGS_CONFIG.ARTIST,
  )
  const currentPortfolioImageRefs = currentPortfolioImages.map(
    (image) => image.asset._ref,
  )
  const nonDupeImageRefs = portfolioImages.filter(
    (image) => !currentPortfolioImageRefs.includes(image.asset._ref),
  )

  return nonDupeImageRefs
}

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

  return NextResponse.json(
    {
      booksOpen: patchOperation.booksOpen,
      booksOpenAt: patchOperation.booksOpenAt,
    },
    { status: 200 },
  )
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

  let patchOperation: SanityDocument<Record<string, any>>
  if (headshot === 'DELETE') {
    patchOperation = await client.patch(artistId).unset(['headshot']).commit()
  } else {
    patchOperation = await client
      .patch(artistId)
      .set({ headshot: headshot })
      .commit()
  }

  console.log(
    `Patch operation completed for ArtistId ${artistId}`,
    `Headshot: ${patchOperation.headshot}`,
  )

  return NextResponse.json(
    {
      headshot: patchOperation.headshot,
    },
    { status: 200 },
  )
}

const updatePortfolioImages = async (
  client: SanityClient,
  artistId: string,
  operation: 'APPEND' | 'DELETE',
  portfolioImages: ImageReference[],
): Promise<NextResponse> => {
  console.log(
    `Patch artist portfolio images with Id: ${artistId}`,
    `PortfolioImages: ${portfolioImages}`,
  )

  let patchOperation: SanityDocument<Record<string, any>>
  if (operation === 'DELETE') {
    if (portfolioImages.length > 1) {
      return new NextResponse(
        `Error performing PATCH on artist with id ${artistId}`,
        {
          status: 400,
          statusText: 'RemoveMultipleReferencesUnsupported',
        },
      )
    }

    // JSONMatch search for the reference given to delete
    const unsetOp = [
      `portfolioImages[asset._ref=="${portfolioImages[0].asset._ref}"]`,
    ]
    patchOperation = await client
      .patch(artistId)
      .setIfMissing({ portfolioImages: [] })
      .unset(unsetOp)
      .commit({ autoGenerateArrayKeys: true })
  } else {
    // Getting an error for images that already exist.
    // Need to query for current portfolioImages so we can skip any that already exist.
    const nonDupeImageRefs = await filterDuplicatePortfolioImages(
      client,
      artistId,
      portfolioImages,
    )
    patchOperation = await client
      .patch(artistId)
      .setIfMissing({ portfolioImages: [] })
      .append('portfolioImages', nonDupeImageRefs)
      .commit({ autoGenerateArrayKeys: true })
  }

  console.log(
    `Patch operation completed for ArtistId ${artistId}`,
    `PortfolioImages: ${patchOperation.portfolioImages}`,
  )

  return NextResponse.json(
    {
      portfolioImages: patchOperation.portfolioImages,
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
  const {
    artistId,
    booksOpen,
    booksOpenAt,
    headshot,
    portfolioImages,
    operation,
  } = body

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

  if (portfolioImages && operation) {
    return await updatePortfolioImages(
      client,
      artistId,
      operation,
      portfolioImages,
    )
  }

  return new NextResponse(
    `Error performing PATCH on artist with id ${artistId}`,
    {
      status: 500,
      statusText: 'NoOperationFound',
    },
  )
}
