import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

type WebhookPayload = {
  _type: string
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SANITY_REVALIDATE_SECRET) {
      return new NextResponse(
        'Missing environment variable SANITY_REVALIDATE_SECRET',
        { status: 500 },
      )
    }

    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    )

    if (!isValidSignature) {
      const message = 'Invalid signature'
      return new NextResponse(
        JSON.stringify({ message, isValidSignature, body }),
        {
          status: 401,
        },
      )
    } else if (!body?._type) {
      const message = 'Bad Request'
      return new NextResponse(JSON.stringify({ message, body }), {
        status: 400,
      })
    }

    revalidateTag(body._type)

    return NextResponse.json({ body })
  } catch (error) {
    console.error('Error in revalidate tag webhook endpoint.', error)

    return new NextResponse(
      `There was an error in revalidate tag webhook endpoint`,
      {
        status: 500,
        statusText: JSON.stringify(error),
      },
    )
  }
}
