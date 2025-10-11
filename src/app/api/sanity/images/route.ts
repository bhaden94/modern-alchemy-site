import groq from 'groq'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import {
  authOptions,
  logAuthorizedRequest,
  notAuthorizedResponse,
} from '~/lib/next-auth/auth.utils'
import { getClient } from '~/lib/sanity/sanity.client'
import { ImageReference } from '~/lib/sanity/sanity.image'

const token = process.env.SANITY_API_WRITE_TOKEN

interface ImagesPutResponseBody {
  imageReferences: ImageReference[]
}

export const maxDuration = 60 // This function can run for up to 60 seconds

// upload image assets to sanity
// return references
export async function PUT(
  request: NextRequest,
): Promise<NextResponse<ImagesPutResponseBody>> {
  const client = getClient(token)
  const data = Object.fromEntries(await request.formData())
  const imagesArray = Array.from(Object.values(data))

  try {
    console.log(`Start image upload for ${imagesArray.length} images.`)

    // Upload images to Sanity and get their references
    const imageReferences: ImageReference[] = await Promise.all(
      imagesArray.map(async (image: FormDataEntryValue) => {
        const imageData = await client.assets.upload('image', image as File)
        return {
          _key: imageData._id,
          _type: 'image',
          asset: {
            _ref: imageData._id,
            _type: 'reference',
          },
        }
      }),
    )

    console.log('Image references created: ', imageReferences)

    return NextResponse.json(
      { imageReferences: imageReferences },
      { status: 200 },
    )
  } catch (error) {
    console.error('There was an error uploading images')

    return new NextResponse(`There was an error uploading images`, {
      status: 500,
      statusText: JSON.stringify(error),
    })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return notAuthorizedResponse(request)
  logAuthorizedRequest(session, request)

  const client = getClient(token)
  const body: { imageReferences?: ImageReference[]; imageIds?: string[] } =
    await request.json()

  if (!body.imageReferences && !body.imageIds) {
    console.error('No image references or IDs were given.')
    return NextResponse.json({
      status: 500,
      errorCode: 'MissingImages',
    })
  }

  const imageIds = body.imageIds
    ? body.imageIds
    : body.imageReferences?.map((image) => image._key)

  console.log(`Deleting ${imageIds?.length} image asset(s)...`)
  console.table(body.imageIds || body.imageReferences)

  await client
    .delete({
      query: groq`*[_id in $imageIds]`,
      params: { imageIds: imageIds },
    })
    .catch((err) => {
      console.error('Error deleting image assets', err)
      return NextResponse.json({
        status: 500,
        errorCode: 'Failed to delete images',
      })
    })

  console.log('Finished deleting image assets')

  return NextResponse.json({}, { status: 200 })
}
