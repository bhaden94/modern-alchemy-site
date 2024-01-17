import { Container, Text } from '@mantine/core'

import classes from './SuccessfullBooking.module.css'

const SuccessfullBooking = () => {
  return (
    <div className={classes.root}>
      <Container>
        <Text className={classes.label} c="var(--mantine-primary-color-filled)">
          Success
        </Text>
        <Text className={classes.title}>
          Your request has been submitted to the artist.
        </Text>
        <Text size="lg" ta="center" c="dimmed" className={classes.description}>
          You will hear from them if they would like to move forward with your
          idea.
        </Text>
      </Container>
    </div>
  )
}

export default SuccessfullBooking
