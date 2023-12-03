import { createClient, SanityClient } from '@sanity/client'

import { apiVersion, dataset, projectId, useCdn } from '~/lib/sanity/sanity.api'

export function getClient(token?: string): SanityClient {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: 'published',
  })
  if (!token) {
    return client
  }
  return client.withConfig({
    token: token,
    useCdn: false,
    ignoreBrowserTokenWarning: true,
  })
}

export function getPreviewClient(preview?: { token: string }): SanityClient {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: 'published',
  })
  if (preview) {
    if (!preview.token) {
      throw new Error('You must provide a token to preview drafts')
    }
    return client.withConfig({
      token: preview.token,
      useCdn: false,
      ignoreBrowserTokenWarning: true,
      perspective: 'previewDrafts',
    })
  }
  return client
}
