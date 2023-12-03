export type FeatureType = {
  [key: string]: boolean
}

export interface FeatureFlagsContextValue {
  features: FeatureType | null
}
