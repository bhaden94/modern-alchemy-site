import { groq } from 'next-sanity'
import { Observable } from 'rxjs'
import { SanityClient } from 'sanity'

import { FeatureFlag } from '~/types/SchemaTypes'

type paramsType = { [key: string]: string; flagType: 'featureFlag' }

const featureFlagParams: paramsType = { flagType: 'featureFlag' }
const featureFlagsQuery = groq`*[_type == $flagType]`
const featureFlagQueryByKey = groq`*[_type == $flagType && key == $key][0]`

export async function getFeatureFlags(
  client: SanityClient,
): Promise<FeatureFlag[]> {
  return await client.fetch(featureFlagsQuery, featureFlagParams)
}

export async function getSingleFeatureFlag(
  client: SanityClient,
  key: string,
): Promise<FeatureFlag> {
  featureFlagParams['key'] = key
  return await client.fetch(featureFlagQueryByKey, featureFlagParams)
}

export function listenForFeatureFlagChanges(
  client: SanityClient,
): Observable<Record<string, any>> {
  return client.listen(featureFlagsQuery, featureFlagParams)
}
