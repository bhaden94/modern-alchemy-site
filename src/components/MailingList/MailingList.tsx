'use client'

import {
  Anchor,
  Button,
  Card,
  Stack,
  Text,
  TextInput,
  Title,
  Transition,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconMailOpened } from '@tabler/icons-react'
import { zodResolver } from 'mantine-form-zod-resolver'
import Link from 'next/link'
import { useState } from 'react'
import { z } from 'zod'

import { useErrorDialog } from '~/hooks/useErrorDialog'
import { MailingListContent } from '~/schemas/models/mailingList'
import { NavigationInternalIds, NavigationPages } from '~/utils/navigation'

import classes from './MailingList.module.css'

const mailingListSchema = z.object({
  email: z.string().email(),
})

type TMailingListSchema = z.infer<typeof mailingListSchema>

interface IMailingList {
  content?: MailingListContent
}

const MailingList = ({ content }: IMailingList) => {
  const { openErrorDialog } = useErrorDialog()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const successTitle = content?.successMessage || 'Thank you for subscribing!'
  const subscribeTitle = content?.formTitle || 'Subscribe to our mailing list'

  // Animation settings
  const transitionDuration = 300 // Duration for the transition effects
  const transition = 'fade'
  const timingFunction = 'ease'

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

  if (!content?.isActive) return null

  return (
    <div className={classes.container} id={NavigationInternalIds.MailingList}>
      <div className={classes.iconContainer}>
        <IconMailOpened size={32} stroke={1.5} />
      </div>
      <Card shadow="sm" className={classes.card}>
        <Stack className={classes.cardContent}>
          {/* Show form */}
          <Transition
            mounted={!isSuccess}
            transition={transition}
            duration={transitionDuration}
            timingFunction={timingFunction}
          >
            {(styles) => (
              <Title ta="center" order={3} style={styles}>
                {subscribeTitle}
              </Title>
            )}
          </Transition>
          <Transition
            mounted={!isSuccess}
            transition={transition}
            duration={transitionDuration}
            timingFunction={timingFunction}
          >
            {(styles) => <div style={styles}>{renderForm()}</div>}
          </Transition>

          {/* Success */}
          <Transition
            mounted={isSuccess}
            transition={transition}
            duration={transitionDuration}
            timingFunction={timingFunction}
            enterDelay={transitionDuration + 5} // Small delay to let form fade out first
          >
            {(styles) => (
              <Title ta="center" order={3} style={styles}>
                {successTitle}
              </Title>
            )}
          </Transition>
        </Stack>
      </Card>
    </div>
  )
}

export default MailingList
