import type { NextApiRequest, NextApiResponse } from 'next'

import { getClient } from '~/lib/sanity/sanity.client'
import { schemaTypes } from '~/schemas'

const token = process.env.SANITY_API_WRITE_TOKEN

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = getClient(token)
  const method = req.method
  const body = JSON.parse(req.body)
  console.log(body)

  if (method !== 'PUT')
    return res.status(400).json('requsted method not available')

  //   const result = await asyncParse(req)
  // the showcaseImages array is empty when we get to the api route
  //   console.log(result)

  try {
    // const imagesArray = Array.from(body.showcaseImages)

    // Upload images to Sanity and get their references
    //   const imageReferences = await Promise.all(
    //     imagesArray.map(async (image: UploadBody) => {
    //       const imageData = await client.assets.upload('image', image)
    //       return {
    //         _key: imageData._id,
    //         _type: 'image',
    //         asset: {
    //           _ref: imageData._id,
    //           _type: 'reference',
    //         },
    //       }
    //     }),
    //   )

    // Submit the form data to Sanity CMS
    const response = await client.create({
      _type: schemaTypes.booking.name,
      ...body,
      showcaseImages: body.imageReferences,
    })

    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json(error)
  }
}
