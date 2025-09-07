import { Title } from '@mantine/core'

import classes from './PageTitle.module.css'

const PageTitle = ({
  title,
  className,
}: {
  title: string
  className?: string
}) => {
  return (
    <Title ta="center" className={className || classes.title}>
      {title}
    </Title>
  )
}

export default PageTitle
