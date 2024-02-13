import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

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
  toEmail: string,
  subject: string,
  text: string,
  base64Images: any[],
) => {
  const mailOptions: Mail.Options = {
    from: process.env.GMAIL_ACCOUNT,
    to: toEmail,
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
  return await emailTransporter.sendMail(mailOptions)
}
