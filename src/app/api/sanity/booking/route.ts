import { NextRequest, NextResponse } from 'next/server'

import { getClient } from '~/lib/sanity/sanity.client'

const token = process.env.SANITY_API_WRITE_TOKEN

// TODO: improve responses for both routes
export async function PUT(request: NextRequest) {
  const client = getClient(token)
  const body = await request.json()

  try {
    // Submit the form data to Sanity CMS
    const response = await client.create({
      _type: 'booking',
      ...body,
    })

    return NextResponse.json({ status: 'okay' })
  } catch (error) {
    // TODO: handle errors
    return NextResponse.json({ status: 'notOkay' })
  }
}

export async function DELETE(request: NextRequest) {
  const client = getClient(token)
  const body = await request.json()

  if (!body.id) return NextResponse.json({ status: 'id not given' })

  const response = await client
    .delete(body.id)
    .catch((err) => NextResponse.json(err))

  return NextResponse.json(response)
}
