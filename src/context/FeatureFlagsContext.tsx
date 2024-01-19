'use client'

import { createContext, useEffect, useState } from 'react'

import {
  getFeatureFlags,
  listenForFeatureFlagChanges,
} from '~/lib/sanity/queries/sanity.featuresQuery'
import { getClient } from '~/lib/sanity/sanity.client'
import { FeatureFlag } from '~/schemas/models/feature-flags'
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
      const currentFeatures = await getFeatureFlags(client)
      const flags = createProviderFlags(currentFeatures)
      setFeatureFlags(flags)
    }

    fetchFeatureFlags()

    const subscription = listenForFeatureFlagChanges(client).subscribe(
      (update: Record<string, any>) => {
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // featureFlags is not a real dependency here
  // because it is only read in the subscription

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
