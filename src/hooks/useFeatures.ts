import { useContext } from 'react'
import { FeatureFlagsContext } from '~/context/FeatureFlagsContext'
import { FeatureFlagsContextValue } from '~/types/FeatureFlagContextValue'

export function useFeatures(): FeatureFlagsContextValue {
  const context = useContext(FeatureFlagsContext)
  if (context === undefined) {
    throw new Error('useFeature must be used within a FeatureProvider')
  }
  return context
}
