import groq from 'groq'
import { NextRequest, NextResponse } from 'next/server'

import { getClient } from '~/lib/sanity/sanity.client'

const token = process.env.SANITY_API_WRITE_TOKEN

type ImageReference = {
  _key: string
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

// upload image assets to sanity
// return references
export async function PUT(request: NextRequest) {
  const client = getClient(token)
  const data = Object.fromEntries(await request.formData())
  const imagesArray = Array.from(Object.values(data))

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
  // TODO: handle errors

  return NextResponse.json({ imageReferences: imageReferences })
}

export async function DELETE(request: NextRequest) {
  const client = getClient(token)
  const body: { imageReferences: ImageReference[] } = await request.json()

  if (!body.imageReferences) console.error('No image references')

  const imageIds: string[] = body.imageReferences.map((image) => image._key)

  console.log(`Deleting ${imageIds.length} image assets...`)
  console.table(body.imageReferences)

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

  return NextResponse.json({ status: 200 })
}
