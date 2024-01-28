import { NextRequest, NextResponse } from 'next/server'

import { getClient } from '~/lib/sanity/sanity.client'

const token = process.env.SANITY_API_WRITE_TOKEN

// TODO: improve responses for both routes
export async function PUT(request: NextRequest) {
  const client = getClient(token)
  const body = await request.json()

  try {
    console.log(`Start booking request create for ${body.name}: ${body.email}`)

    // Submit the form data to Sanity CMS
    const response = await client.create({
      _type: 'booking',
      ...body,
    })

    console.log('Booking created with data: ', response)

    return NextResponse.json({ status: 'Success' })
  } catch (error) {
    console.error(`There was an error creating the booking for ${body.name}`)

    return new NextResponse(
      `There was an error creating the booking for ${body.name}`,
      {
        status: 500,
        statusText: JSON.stringify(error),
      },
    )
  }
}

// TODO: Check request is coming from authenticated user
export async function DELETE(request: NextRequest) {
  const client = getClient(token)
  const body = await request.json()

  if (!body.id) return NextResponse.json({ status: 'id not given' })

  const response = await client
    .delete(body.id)
    .catch((err) => NextResponse.json(err))

  return NextResponse.json(response)
}
