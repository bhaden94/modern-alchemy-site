import { NextRequest, NextResponse } from 'next/server'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

import { sendMail } from '~/lib/mailer/mailer.utils'
import {
  BookingField,
  GenericBookingField,
  TBookingSchema,
  TGenericBookingSchema,
} from '~/utils/forms/bookingFormUtils'

interface IAdditionalBodyFields {
  isGeneric?: boolean
  base64Images: string[]
  artistId: string
  artistEmail: string | string[]
}

export const maxDuration = 60

const buildEmailText = (
  body: TBookingSchema | TGenericBookingSchema,
  fields: object,
): string => {
  const emailTextArray = Object.values(fields).map((field) => {
    if (field.id !== GenericBookingField.ReferenceImages.id) {
      // @ts-ignore – body shape differs but fields exist for generic bookings
      const bodyVal: string = body[field.id]
      return `
${field.label}:
- ${field.getValue(bodyVal)}
        `
    }
    return ''
  })
  return emailTextArray.join('\n')
}

export async function PUT(request: NextRequest) {
  const body: IAdditionalBodyFields & (TBookingSchema | TGenericBookingSchema) =
    await request.json()

  const emailText = buildEmailText(
    body,
    body.isGeneric ? GenericBookingField : BookingField,
  )

  console.log(
    `Sending email to artist email(s) ${
      Array.isArray(body.artistEmail)
        ? body.artistEmail.join(', ')
        : body.artistEmail
    } with text: `,
    emailText,
  )

  try {
    const mailResponse: SMTPTransport.SentMessageInfo = await sendMail(
      body.artistEmail,
      body.email,
      `${body.name} Booking Request`,
      emailText,
      body.base64Images ?? [],
    )

    console.log('Email response: ', mailResponse)

    return NextResponse.json({ status: 200 })
  } catch (error) {
    console.log('Error sending email', error)

    return new NextResponse(`There was an error sending the email`, {
      status: 500,
      statusText: JSON.stringify(error),
    })
  }
}
