'use client'

import { useDisclosure } from '@mantine/hooks'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const openDialog = (message?: string) => {
    if (message) setSuccessMessage(message)
    open()

    // Clear any existing timeout before setting a new one
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Auto close after 3 seconds
    timeoutRef.current = setTimeout(() => {
      close()
    }, 3000)
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
