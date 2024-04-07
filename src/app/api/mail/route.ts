import { NextRequest, NextResponse } from 'next/server'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

import { sendMail } from '~/lib/mailer/mailer.utils'
import { BookingField, TBookingSchema } from '~/utils/forms/bookingFormUtils'

interface IAdditionalBodyFields {
  base64Images: string[]
  artistId: string
  artistEmail: string
}

export async function PUT(request: NextRequest) {
  const body: TBookingSchema & IAdditionalBodyFields = await request.json()

  const emailTextArray = Object.values(BookingField).map((field) => {
    if (field.id !== BookingField.ReferenceImages.id) {
      // ignore TS error here since we know types are a match
      // @ts-ignore
      const bodyVal: string & string[] = body[field.id]
      return `
${field.label}:
- ${field.getValue(bodyVal)}
      `
    }
  })

  const emailText = emailTextArray.join('\n')

  console.log(
    `Sending email to artist email ${body.artistEmail} with text: `,
    emailText,
  )

  const mailResponse: SMTPTransport.SentMessageInfo = await sendMail(
    body.artistEmail,
    body.email,
    `${body.name} Booking Request`,
    emailText,
    body.base64Images,
  )

  console.log('Email response: ', mailResponse)

  return NextResponse.json({ status: 200 })
}
