import { Button, Container, Group, Text, Title } from '@mantine/core'
import Link from 'next/link'

import { NavigationPages } from '~/utils/navigation'

import classes from './PageInProgress.module.css'

const PageInProgress = () => {
  return (
    <Container className={classes.root}>
      <Title className={classes.title}>You have found a secret place.</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        Unfortunately, this area is not ready yet. Please check back later.
      </Text>
      <Group justify="center">
        <Button
          component={Link}
          href={NavigationPages.Home}
          variant="subtle"
          size="md"
        >
          Take me back to home page
        </Button>
      </Group>
    </Container>
  )
}

export default PageInProgress
