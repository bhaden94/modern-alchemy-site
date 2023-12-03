'use client'

import { createContext, useEffect,useState } from 'react'

import { getClient } from '~/lib/sanity/sanity.client'
import {
  FeatureFlag,
  getFeatureFlags,
  listenForFeatureFlagChanges,
} from '~/lib/sanity/sanity.queries'
import { Feature } from '~/types/FeatureEnum'
import {
  FeatureFlagsContextValue,
  FeatureType,
} from '~/types/FeatureFlagContextValue'

type FeatureProviderProps = {
  children: React.ReactNode
}

export const FeatureFlagsContext = createContext<
  FeatureFlagsContextValue | undefined
>(undefined)

export function FeatureProvider({ children }: FeatureProviderProps) {
  const [featureFlags, setFeatureFlags] = useState<FeatureType | null>(null)

  useEffect(() => {
    const client = getClient(undefined)
    const fetchFeatureFlags = async () => {
      const featureFlags = await getFeatureFlags(client)
      const flags = createProviderFlags(featureFlags)
      setFeatureFlags(flags)
    }

    fetchFeatureFlags()

    const subscription = listenForFeatureFlagChanges(client).subscribe(
      (update: { result: FeatureFlag }) => {
        let currentFeatures = { ...featureFlags }
        if (currentFeatures) {
          currentFeatures[update?.result?.key || 'missingKey'] =
            update?.result?.status || false
          setFeatureFlags(currentFeatures)
        }
      },
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [featureFlags, setFeatureFlags])

  return (
    <FeatureFlagsContext.Provider value={{ features: featureFlags }}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}

function createProviderFlags(flags: FeatureFlag[]): FeatureType {
  let flagsObj: FeatureType = {
    [Feature.BooksOpen]: false,
  }

  flags.forEach((feature: FeatureFlag) => {
    const key = feature.key
    const status = feature.status
    flagsObj[key] = status
  })

  return flagsObj
}
