import { Container, Text } from '@mantine/core'

import classes from './SuccessfullBooking.module.css'

interface ISuccessfullBooking {
  artistName: string
}

const SuccessfullBooking = ({ artistName }: ISuccessfullBooking) => {
  return (
    <div className={classes.root}>
      <Container>
        <Text className={classes.label} c="var(--mantine-primary-color-filled)">
          Success
        </Text>
        <Text className={classes.title}>
          Your request has been submitted to {artistName}.
        </Text>
        <Text size="lg" ta="center" c="dimmed" className={classes.description}>
          They will review the submissions and determine if this project is the
          right fit for them. Once confirmed, we will contact you and require a
          DEPOSIT to book an appointment. DEPOSITS are{' '}
          <Text span fw={700}>
            NON-REFUNDABLE
          </Text>{' '}
          and{' '}
          <Text span fw={700}>
            FINAL
          </Text>{' '}
          and go towards the final price of the finished project during your
          last session.
        </Text>
      </Container>
    </div>
  )
}

export default SuccessfullBooking
