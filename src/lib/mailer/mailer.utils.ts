import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

function sendMailWithRetry(
  fn: () => Promise<SMTPTransport.SentMessageInfo>,
  maxAttempts = 3,
  baseDelayMs = 1000,
) {
  let attempt = 1

  const execute = async (): Promise<SMTPTransport.SentMessageInfo> => {
    try {
      const response = await fn()

      console.log('Email response in retry function: ', response)

      if (response.rejected.length > 0) {
        throw new Error(JSON.stringify(response))
      }

      return response
    } catch (error) {
      if (attempt >= maxAttempts) {
        throw error
      }

      console.log(`Retry attempt ${attempt} after ${baseDelayMs}ms`)
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs))

      attempt++
      return execute()
    }
  }

  return execute()
}

// TODO: write code to refresh token when expired
const createTransporter =
  (): nodemailer.Transporter<SMTPTransport.SentMessageInfo> => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_ACCOUNT,
        clientId: process.env.GMAIL_AUTH_ID,
        clientSecret: process.env.GMAIL_AUTH_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: process.env.GMAIL_ACCESS_TOKEN,
      },
    })

    return transporter
  }

export const sendMail = async (
  toEmail: string | string[],
  replyToEmail: string,
  subject: string,
  text: string,
  base64Images: any[],
) => {
  const mailOptions: Mail.Options = {
    from: process.env.GMAIL_ACCOUNT,
    to: toEmail,
    replyTo: replyToEmail,
    subject: subject,
    text: text,
    attachments: base64Images.map((url, i) => {
      return {
        filename: `Booking Request Image ${i}`,
        path: url,
      }
    }),
  }

  let emailTransporter = createTransporter()
  return sendMailWithRetry(() => emailTransporter.sendMail(mailOptions))
}
