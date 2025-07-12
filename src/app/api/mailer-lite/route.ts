import MailerLite from '@mailerlite/mailerlite-nodejs'
import { NextResponse } from 'next/server'

interface Body {
  email: string
  name?: string
  phoneNumber?: string
  shouldResubscribe?: boolean
}

const API_KEY = process.env.MAILER_LITE_API_KEY || ''
const BOOKING_GROUP_ID = process.env.MAILER_LITE_GROUP_ID || ''

const mlClient = new MailerLite({
  api_key: API_KEY,
})

export async function POST(request: Request) {
  const body: Body = await request.json()
  const { email, name, phoneNumber, shouldResubscribe } = body

  console.log('Starting to create/update a subscriber with body:', body)

  if (!email) {
    return new NextResponse(
      `Required field to create/update a subscriber missing.`,
      {
        status: 400,
        statusText: 'EmailMissing',
      },
    )
  }

  try {
    const response = await mlClient.subscribers.createOrUpdate({
      email: email,
      fields: {
        name: name,
        phone: phoneNumber,
      },
      groups: [BOOKING_GROUP_ID],
      status: 'active',
      // resubscribe does exist, but is not officially documented.
      // @ts-ignore
      resubscribe: shouldResubscribe ?? false,
    })

    console.log('Subscriber created/updated', response.data.data)

    return NextResponse.json(response.data.data, {
      status: 200,
    })
  } catch (error) {
    console.error('Error creating subscriber:', error)

    return new NextResponse('Error creating new mailing list subscriber.', {
      status: 500,
      statusText: 'InternalServerError',
    })
  }
}
