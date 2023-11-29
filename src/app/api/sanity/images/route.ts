import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '~/lib/sanity/sanity.client'

const token = process.env.SANITY_API_WRITE_TOKEN

// upload image assets to sanity
// return references
export async function PUT(request: NextRequest) {
  const client = getClient(token)
  const data = Object.fromEntries(await request.formData())
  const imagesArray = Array.from(Object.values(data))

  // Upload images to Sanity and get their references
  const imageReferences = await Promise.all(
    imagesArray.map(async (image: File) => {
      const imageData = await client.assets.upload('image', image)
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
