import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import {
  authOptions,
  logAuthorizedRequest,
  notAuthorizedResponse,
} from '~/lib/next-auth/auth.utils'
import { getClient } from '~/lib/sanity/sanity.client'

const token = process.env.SANITY_API_WRITE_TOKEN

export async function PUT(request: NextRequest) {
  const client = getClient(token)
  const body = await request.json()
  delete body.bodyPlacementImages // remove extra field

  try {
    console.log(`Start booking request create for ${body.name}: ${body.email}`)
    // Submit the form data to Sanity CMS
    const response = await client.create({
      _type: 'booking',
      ...body,
    })

    console.log('Booking created with data: ', response)

    return NextResponse.json({}, { status: 200 })
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

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return notAuthorizedResponse(request)
  logAuthorizedRequest(session, request)

  const client = getClient(token)
  const body = await request.json()

  if (!body.id)
    return NextResponse.json({}, { status: 400, statusText: 'MissingId' })

  const response = await client
    .delete(body.id)
    .catch((err) => NextResponse.json(err, { status: 400 }))

  return NextResponse.json(response, { status: 200 })
}
