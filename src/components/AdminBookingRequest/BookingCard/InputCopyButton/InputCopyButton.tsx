import { ActionIcon, CopyButton, rem } from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'

const InputCopyButton = ({ value }: { value: string }) => {
  return (
    <CopyButton value={value} timeout={2000}>
      {({ copied, copy }) => (
        <ActionIcon
          color={
            copied
              ? 'var(--mantine-primary-color-filled)'
              : 'var(--mantine-color-text)'
          }
          variant="subtle"
          onClick={copy}
        >
          {copied ? (
            <IconCheck style={{ width: rem(20) }} />
          ) : (
            <IconCopy style={{ width: rem(20) }} />
          )}
        </ActionIcon>
      )}
    </CopyButton>
  )
}

export default InputCopyButton
