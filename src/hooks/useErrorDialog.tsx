'use client'

import { useDisclosure } from '@mantine/hooks'
import { createContext, useContext, useState } from 'react'

import ErrorDialog from '~/components/ErrorDialog/ErrorDialog'

type ErrorDialogContextType = {
  openErrorDialog: (message?: string) => void
  closeErrorDialog: () => void
}

const ErrorDialogContext = createContext<ErrorDialogContextType>({
  openErrorDialog: () => {},
  closeErrorDialog: () => {},
})

interface IErrorDialogProvider {
  children: React.ReactNode
}

export const ErrorDialogProvider = ({ children }: IErrorDialogProvider) => {
  const [opened, { open, close }] = useDisclosure(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const openDialog = (message?: string) => {
    if (message) {
      setErrorMessage(message)
    }

    open()

    // Close the dialog after 5 seconds
    setTimeout(() => {
      close()
    }, 5000)
  }

  return (
    <ErrorDialogContext.Provider
      value={{
        openErrorDialog: openDialog,
        closeErrorDialog: close,
      }}
    >
      {children}
      <ErrorDialog opened={opened} onClose={close} message={errorMessage} />
    </ErrorDialogContext.Provider>
  )
}

export const useErrorDialog = () => useContext(ErrorDialogContext)
