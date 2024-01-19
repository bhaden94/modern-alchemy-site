import { NextRequest, NextResponse } from 'next/server'

import { getSingleFeatureFlag } from '~/lib/sanity/queries/sanity.featuresQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { FeatureFlag } from '~/schemas/models/feature-flags'

const token = process.env.SANITY_API_WRITE_TOKEN

export async function PATCH(request: NextRequest) {
  const client = getClient(token)
  const body = await request.json()

  if (!body.key) {
    return NextResponse.json({ status: 'fields missing from body' })
  }

  const featureFlag: FeatureFlag = await getSingleFeatureFlag(client, body.key)

  const response = await client
    .patch(featureFlag._id)
    .set({ status: body.status })
    .commit()
    .then((updatedDocument) => {
      return NextResponse.json(updatedDocument)
    })

  return NextResponse.json(response)
}
