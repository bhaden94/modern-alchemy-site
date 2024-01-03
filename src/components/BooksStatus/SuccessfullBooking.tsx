import { Container,Text, Title } from '@mantine/core'

import classes from './SuccessfullBooking.module.css'

const SuccessfullBooking = () => {
  return (
    <div className={classes.root}>
      <Container>
        <Text className={classes.label}>Success</Text>
        <Text className={classes.title}>
          Your request has been submitted to the artist.
        </Text>
        <Text size="lg" ta="center" c="dimmed" className={classes.description}>
          You will hear from them if they would like to move forward with your
          idea.
        </Text>
        {/* <Group justify="center">
          <Button variant="white" size="md">
            Refresh the page
          </Button>
        </Group> */}
      </Container>
    </div>
  )
}

export default SuccessfullBooking
