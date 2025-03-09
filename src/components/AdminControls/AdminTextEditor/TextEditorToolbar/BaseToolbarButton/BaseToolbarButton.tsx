import { Button, ButtonProps } from '@mantine/core'
import { forwardRef, MouseEventHandler } from 'react'

interface IBaseToolbarButton {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined
  isActive: boolean
  children: React.ReactNode
}

const BaseToolbarButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'> & IBaseToolbarButton & ButtonProps
>((props, ref) => {
  const { onClick, isActive, children, leftSection } = props

  return (
    <Button
      ref={ref}
      variant={isActive ? 'filled' : 'light'}
      radius="xs"
      size="xs"
      onClick={onClick}
      leftSection={leftSection}
    >
      {children}
    </Button>
  )
})
BaseToolbarButton.displayName = 'BaseToolbarButton'

export default BaseToolbarButton
