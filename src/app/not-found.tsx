import { Button, Container, Group,Text, Title } from '@mantine/core'
import Link from 'next/link'

import { NavigationPages } from '~/utils/navigation'

import classes from '../components/PageInProgress/PageInProgress.module.css'

const NotFound = () => {
  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>You have found a secret place.</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        Unfortunately, this is only a 404 page. You may have mistyped the
        address, or the page has been moved to another URL.
      </Text>
      <Group justify="center">
        <Button
          component={Link}
          variant="subtle"
          size="md"
          href={NavigationPages.Home}
        >
          Take me back to home page
        </Button>
      </Group>
    </Container>
  )
}

export default NotFound