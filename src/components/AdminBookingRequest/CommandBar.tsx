'use client'

import { Button } from '@mantine/core'

interface ICommandBar {
  refreshDisabled: boolean
  refreshList: () => void
}

const CommandBar = ({ refreshDisabled, refreshList }: ICommandBar) => {
  return (
    <>
      <Button disabled={refreshDisabled} onClick={refreshList}>
        Refresh list
      </Button>
    </>
  )
}

export default CommandBar
