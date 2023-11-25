import { createContext, useContext, useState } from 'react'

// TODO: split into proper folders and clean up types
export type FeatureType = {
  [key in Feature]: boolean
}

type FeatureProviderProps = {
  children: React.ReactNode
}

interface FeatureFlagsContextValue {
  features: FeatureType
  setFeatureFlags: React.Dispatch<React.SetStateAction<FeatureType>>
}

export const FeatureFlagsContext =
  createContext<FeatureFlagsContextValue>(undefined)

export function FeatureProvider({ children }: FeatureProviderProps) {
  const [featureFlags, setFeatureFlags] = useState<FeatureType>(null)

  return (
    <FeatureFlagsContext.Provider
      value={{ features: featureFlags, setFeatureFlags }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  )
}

export function useFeatures(): FeatureFlagsContextValue {
  const { features, setFeatureFlags } = useContext(FeatureFlagsContext)
  if (features === undefined) {
    throw new Error('useFeature must be used within a FeatureProvider')
  }
  return { features, setFeatureFlags }
}

export enum Feature {
  BooksOpen = 'booksOpen',
}
