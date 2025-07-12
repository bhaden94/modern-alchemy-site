'use client'

import {
  Button,
  Card,
  Stack,
  TextInput,
  Title,
  Text,
  Anchor,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconMailOpened } from '@tabler/icons-react'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useState } from 'react'
import { z } from 'zod'

import { useErrorDialog } from '~/hooks/useErrorDialog'
import classes from './MailingList.module.css'
import Link from 'next/link'
import { NavigationPages } from '~/utils/navigation'

const mailingListSchema = z.object({
  email: z.string().email(),
})

type TMailingListSchema = z.infer<typeof mailingListSchema>

const MailingList = () => {
  const { openErrorDialog } = useErrorDialog()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  // TODO: move to sanity so we can easily update these texts
  const successTitle = 'Thanks for subscribing!'
  const subscribeTitle = "Subscribe to be notified when Larry's books open"

  const form = useForm<TMailingListSchema>({
    initialValues: {
      email: '',
    },
    validate: zodResolver(mailingListSchema),
  })

  const onMantineSubmit = async (data: TMailingListSchema) => {
    setIsSubmitting(true)

    const response = await fetch('/api/mailer-lite', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        shouldResubscribe: true,
      }),
    })

    if (response.ok) {
      setIsSuccess(true)
      form.reset()
    } else {
      openErrorDialog('There was an issue subscribing to the mailing list.')
    }

    setIsSubmitting(false)
  }

  const renderForm = () => {
    return (
      <>
        <form
          className={classes.form}
          onSubmit={form.onSubmit(onMantineSubmit)}
        >
          <TextInput
            {...form.getInputProps('email')}
            disabled={isSubmitting}
            id="email"
            label={<Text span>Email</Text>}
            type="email"
            required
          />
          <Button type="submit" loading={isSubmitting}>
            Subscribe
          </Button>
        </form>
        <Text ta="center" size="sm" c="dimmed">
          You can unsubscribe anytime. For more details, review our{' '}
          <Anchor
            component={Link}
            href={NavigationPages.PrivacyPolicy}
            underline="hover"
            target="_blank"
          >
            Privacy Policy
          </Anchor>
          .
        </Text>
      </>
    )
  }

  return (
    <div className={classes.container} id="mailing-list">
      <div className={classes.iconContainer}>
        <IconMailOpened size={32} stroke={1.5} />
      </div>
      <Card shadow="sm" className={classes.card}>
        <Stack className={classes.cardContent}>
          <Title ta="center" order={3}>
            {isSuccess ? successTitle : subscribeTitle}
          </Title>
          {isSuccess ? undefined : renderForm()}
        </Stack>
      </Card>
    </div>
  )
}

export default MailingList
