import { createContext, useContext, useState } from 'react'

// TODO: split into proper folders and clean up types
export type FeatureType = {
  [key: string]: boolean
}

type FeatureProviderProps = {
  children: React.ReactNode
}

interface FeatureFlagsContextValue {
  features: FeatureType | null
  setFeatureFlags: React.Dispatch<React.SetStateAction<FeatureType>>
}

export const FeatureFlagsContext = createContext<
  FeatureFlagsContextValue | undefined
>(undefined)

export function FeatureProvider({ children }: FeatureProviderProps) {
  const [featureFlags, setFeatureFlags] = useState<FeatureType | null>(null)

  return (
    <FeatureFlagsContext.Provider
      value={{ features: featureFlags, setFeatureFlags }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  )
}

export function useFeatures(): FeatureFlagsContextValue {
  const context = useContext(FeatureFlagsContext)
  if (context === undefined) {
    throw new Error('useFeature must be used within a FeatureProvider')
  }
  return context
}

export enum Feature {
  BooksOpen = 'booksOpen',
}
