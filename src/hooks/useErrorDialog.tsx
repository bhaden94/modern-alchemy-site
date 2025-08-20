'use client'

import { useDisclosure } from '@mantine/hooks'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const openDialog = (message?: string) => {
    if (message) {
      setErrorMessage(message)
    }

    open()

    // Clear any existing timeout before setting a new one
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Auto close after 5 seconds
    timeoutRef.current = setTimeout(() => {
      close()
    }, 5000)
  }

  // Cleanup timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

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
