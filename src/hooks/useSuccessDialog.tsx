'use client'

import { useDisclosure } from '@mantine/hooks'
import { createContext, useContext, useState } from 'react'

import SuccessDialog from '~/components/SuccessDialog/SuccessDialog'

type SuccessDialogContextType = {
  openSuccessDialog: (message?: string) => void
  closeSuccessDialog: () => void
}

const SuccessDialogContext = createContext<SuccessDialogContextType>({
  openSuccessDialog: () => {},
  closeSuccessDialog: () => {},
})

interface ISuccessDialogProvider {
  children: React.ReactNode
}

export const SuccessDialogProvider = ({ children }: ISuccessDialogProvider) => {
  const [opened, { open, close }] = useDisclosure(false)
  const [successMessage, setSuccessMessage] = useState<string | undefined>()

  const openDialog = (message?: string) => {
    if (message) setSuccessMessage(message)
    open()

    // Auto close after 3 seconds
    setTimeout(() => {
      close()
    }, 3000)
  }

  return (
    <SuccessDialogContext.Provider
      value={{
        openSuccessDialog: openDialog,
        closeSuccessDialog: close,
      }}
    >
      {children}
      <SuccessDialog opened={opened} onClose={close} message={successMessage} />
    </SuccessDialogContext.Provider>
  )
}

export const useSuccessDialog = () => useContext(SuccessDialogContext)
