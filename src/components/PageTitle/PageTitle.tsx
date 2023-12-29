import { Title } from '@mantine/core'

import classes from './PageTitle.module.css'

const PageTitle = ({ title }: { title: string }) => {
  return (
    <Title ta="center" className={classes.title}>
      {title}
    </Title>
  )
}

export default PageTitle
