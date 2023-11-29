import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '~/lib/sanity/sanity.client'

const token = process.env.SANITY_API_WRITE_TOKEN

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

// TODO: Add delete route
